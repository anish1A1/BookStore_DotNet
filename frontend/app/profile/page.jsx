"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import axios from "../../utils/axios";
import { useRouter } from "next/navigation";
import {
  BookmarkIcon,
  ShoppingBagIcon,
  StarIcon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  BookIcon,
  BellIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../../utils/auth";
import ProfileOrders from "./ProfileOrders";
import WishlistPage from "../wishlist/page";
import Catalog from "../catalog/page";
import ProfileOrderReviews from "./ProfileOrderReview";
import { OrderContext } from "../../utils/order";
import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { fetchUserData, user, logout } = useContext(AuthContext);
  const { fetchOrders } = useContext(OrderContext);
  const [profileData, setProfileData] = useState({
    userName: "",
    userEmail: "",
    phoneNumber: "",
    profileImage: null,
    defaultStore: "BookLux",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first!");
        router.push("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          toast.error("Session expired, please login again!");
          router.push("/login");
          return;
        }

        await fetchUserData();
        if (!user) {
          toast.error("Failed to fetch user data, please login again!");
          router.push("/login");
          return;
        }

        await fetchNotifications();
      } catch (error) {
        console.error("Auth check error:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session invalid, please login again!");
          router.push("/login");
        } else {
          toast.error("Authentication failed: " + (error.response?.data?.message || "Server error"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        userName: user.userName || "",
        userEmail: user.userEmail || "",
        phoneNumber: user.phoneNumber || "",
        profileImage: null,
        defaultStore: user.defaultStore || "BookLux",
      });
      setPreviewImage(user.profileImage ? `http://localhost:5189${user.profileImage}` : null);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login first!");
      router.push("/login");
    }
  }, [isLoading, user, router]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/order/notifications");
      setNotifications(response.data || []);
      setUnreadCount(response.data.filter((n) => !n.isRead).length || 0);
      console.log("Notifications fetched:", response.data);
    } catch (error) {
      console.error("Fetch notifications error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session invalid, please login again!");
        router.push("/login");
      } else {
        toast.error("Failed to fetch notifications: " + (error.response?.data?.message || "Server error"));
      }
      throw error;
    }
  };

  const markNotificationAsRead = async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
          toast.error("No token found, please login again!");
          router.push("/login");
          return;
      }
      console.log("Sending request with token:", token.substring(0, 20) + "...");
      try {
          await axios.put(`/order/notification/${id}/read`);
          await fetchNotifications();
      } catch (error) {
          console.error("Error marking notification as read:", error.response?.data || error.message);
          if (error.response?.status === 401) {
              localStorage.removeItem("token");
              toast.error("Session invalid, please login again!");
              router.push("/login");
          } else {
              toast.error("Failed to mark notification as read: " + (error.response?.data?.message || "Server error"));
          }
      }
  };

  useEffect(() => {
    if (!user?.userId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found, please login again!");
      router.push("/login");
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5189/notificationhub", {
        accessTokenFactory: () => token,
        transport: HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("OrderFulfilled", (data) => {
      fetchNotifications();
      toast.info("New notification received!");
    });

    connection.on("OrderCancelled", (data) => {
        fetchNotifications();
        toast.info("Order cancelled by staff!");
    });

    const startConnection = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
          const group = `user-${user.userId}`;
          await connection.invoke("JoinGroup", group);
          console.log("SignalR connected successfully to group:", group);
        }
      } catch (err) {
        console.error("SignalR connection error:", err);
        toast.error("Failed to connect to notifications. Please refresh or login again.");
      }
    };

    startConnection();

    return () => {
      if (connection.state === "Connected") {
        connection.stop().catch((err) => console.error("Error stopping SignalR:", err));
      }
    };
  }, [user?.userId, router]);

  const SignOut = async () => {
    try {
      await logout(router);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed: " + (error.message || "Unknown error"));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/user/${user.userId}`, {
        userName: profileData.userName,
        userEmail: profileData.userEmail,
        phoneNumber: profileData.phoneNumber,
        defaultStore: profileData.defaultStore,
      });

      if (profileData.profileImage) {
        const formData = new FormData();
        formData.append("file", profileData.profileImage);
        await axios.put(`/user/${user.userId}/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchUserData();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session invalid, please login again!");
        router.push("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile");
      }
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await axios.put(`/user/${user.userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Password update error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session invalid, please login again!");
        router.push("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to update password");
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mr-4 mb-4 sm:mb-0">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#2C3E50] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user?.userName?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.userName}</h3>
                  <p className="text-gray-600">
                    Member since {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                  <p className="text-[#E3B23C] font-bold">{user?.role || "Member"}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 mb-5 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{user?.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{user?.phoneNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Default Store</p>
                    <p>{profileData.defaultStore || "BookLux"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p>{user?.role || "Member"}</p>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <Link href="#settings" onClick={() => setActiveTab("settings")} className="text-[#E3B23C] hover:text-[#ff5a5c]">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative mb-6">
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
          </div>
        );

      case "orders":
        return <ProfileOrders />;

      case "wishlist":
        return <WishlistPage />;

      case "reviews":
        return <ProfileOrderReviews />;

      case "catalog":
        return <Catalog />;

      case "settings":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-4">Personal Information</h3>
              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border rounded p-2"
                    onChange={handleImageChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={profileData.userName}
                    onChange={(e) => setProfileData({ ...profileData, userName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded p-2"
                    value={profileData.userEmail}
                    onChange={(e) => setProfileData({ ...profileData, userEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Phone</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Default Store</label>
                  <select
                    className="w-full border rounded p-2"
                    value={profileData.defaultStore}
                    onChange={(e) => setProfileData({ ...profileData, defaultStore: e.target.value })}
                  >
                    <option>BookLux</option>
                    <option>BookLux Downtown</option>
                    <option>BookLux University</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <button type="submit" className="bg-[#E3B23C] text-white px-4 py-2 rounded mt-4">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-4">Password</h3>
              <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full border rounded p-2"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full border rounded p-2"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full border rounded p-2"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <button type="submit" className="bg-[#E3B23C] text-white px-4 py-2 rounded mt-4">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <div className="bg-white shadow rounded-lg p-6">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="mb-4 p-4 border rounded-lg hover:bg-gray-50"
                    onClick={() => {
                      if (!notification.isRead) markNotificationAsRead(notification.id);
                    }}
                  >
                    <p className={notification.isRead ? "text-gray-600" : "font-bold"}>{notification.message}</p>
                    <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p>No notifications available.</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-6">My Account</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#2C3E50] rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {user?.userName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{user?.userName}</h3>
                    <p className="text-sm text-[#E3B23C]">{user?.role || "Member"}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2 space-y-1">
                {[
                  { key: "profile", icon: UserIcon, label: "Profile" },
                  { key: "orders", icon: ShoppingBagIcon, label: "Orders" },
                  { key: "wishlist", icon: BookmarkIcon, label: "Wishlist" },
                  { key: "reviews", icon: StarIcon, label: "Reviews" },
                  { key: "catalog", icon: BookIcon, label: "Collections" },
                  { key: "settings", icon: SettingsIcon, label: "Settings" },
                  { key: "notifications", icon: BellIcon, label: "Notifications" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center w-full px-4 py-2 rounded text-left ${
                      activeTab === key ? "bg-[#fdf7e6] text-[#E3B23C]" : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {label}
                    {key === "notifications" && unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                ))}
                <button
                  onClick={SignOut}
                  className="flex items-center w-full px-4 py-2 rounded text-left text-red-500 hover:bg-gray-100"
                >
                  <LogOutIcon size={18} className="mr-3" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
          <div className="w-full md:w-3/4">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}