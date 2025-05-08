"use client";

import { useState, useEffect, useContext } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../../utils/auth";
import ProfileOrders from "./ProfileOrders";
import WishlistPage from "../wishlist/page";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();
  const { fetchUserData, user, setUser } = useContext(AuthContext);
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

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        toast.error("Please login first!");
        return;
      }

      await fetchUserData();
      setIsLoading(false);
    };

    checkAuth();
  }, [fetchUserData, router]);

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

  // Redirect if user is not authenticated after loading
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      toast.error("Please login first!");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Prevent rendering if user is not authenticated
  }

  const SignOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
    toast.success("Logged out successfully");
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
      await axios.put(
        `/user/${user.Id}`,
        {
          userName: profileData.userName,
          userEmail: profileData.userEmail,
          phoneNumber: profileData.phoneNumber,
          defaultStore: profileData.defaultStore,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (profileData.profileImage) {
        const formData = new FormData();
        formData.append("file", profileData.profileImage);
        await axios.post(`/user/${user.Id}/upload-image`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      fetchUserData();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await axios.put(
        `/user/${user.Id}/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
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
                  <p className="text-[#E3B23C] font-bold">{user?.membershipLevel || "Standard Member"}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p>{user?.defaultStore || "BookLux"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membership Level</p>
                    <p>{user?.membershipLevel || "Standard"} ({user?.discountPercentage || 0}% discount)</p>
                  </div>
                </div>
                <Link href="#settings" onClick={() => setActiveTab("settings")} className="text-[#E3B23C] mt-4 hover:underline">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        );

      case "orders":
        return <ProfileOrders />;

      case "wishlist":
        return <WishlistPage/>;

      case "reviews":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
          </div>
        );

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
      default:
        return null;
    }
  };

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
                    <p className="text-sm text-[#E3B23C]">{user?.membershipLevel || "Standard Member"}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2 space-y-1">
                {[
                  { key: "profile", icon: UserIcon, label: "Profile" },
                  { key: "orders", icon: ShoppingBagIcon, label: "Orders" },
                  { key: "wishlist", icon: BookmarkIcon, label: "Wishlist" },
                  { key: "reviews", icon: StarIcon, label: "Reviews" },
                  { key: "settings", icon: SettingsIcon, label: "Settings" },
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