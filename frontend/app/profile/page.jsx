// app/dashboard/page.jsx
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
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const {fetchUserData, user} = useContext(AuthContext);
  const SignOut = async () => {
    localStorage.removeItem("token");
    router.push("/login");
    const stopTime = setTimeout(() => {
      toast.success("Logged out successfully");
      clearTimeout(stopTime);
    }, 2000);
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  if (!user) {
    router.push("/login");
    toast.error("Please login first!");
    return;
  }

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/login");
  //   }
   
  // }, [router]);
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                <div className="w-20 h-20 bg-[#2C3E50] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 mb-4 sm:mb-0">
                  AJ
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.userName} </h3>
                  <p className="text-gray-600">Member since June 2022</p>
                  <p className="text-[#E3B23C] font-bold">Gold Member</p>
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
                    <p>{user?.phoneNumber ? user?.phoneNumber : 9800000000}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Default Store</p>
                    <p>BookLux</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membership Level</p>
                    <p>Gold (10% discount)</p>
                  </div>
                </div>
                <button className="text-[#E3B23C] mt-4 hover:underline">
                  Edit Profile
                </button>
              </div>
            </div>
            
          </div>
        );

      case "orders":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            {/** Example Order Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Order #BL-2023-7845</p>
                    <p className="text-sm text-gray-500">July 14, 2023</p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full">
                    Ready for Pickup
                  </div>
                </div>
              </div>
              <div className="p-4">
                {[{
                  id:1, cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
                  title:"The Silent Echo", qty:1
                },{
                  id:2, cover:"https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
                  title:"Quantum Horizons", qty:2
                }].map((item) => (
                  <div key={item.id} className="flex items-center mb-4">
                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-sm">
                      Total: <span className="font-bold">$79.77</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Claim Code: BLX-45678-92K
                    </p>
                  </div>
                  <button
                    onClick={() => {}}
                    className="text-[#2C3E50] text-sm hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
            {/** Additional orders would follow... */}
          </div>
        );

      case "wishlist":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  cover:
                    "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=800&q=80",
                  title: "The Art of Strategy",
                  author: "Elizabeth Morgan",
                  price: 35.99,
                },
                {
                  id: 2,
                  cover:
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
                  title: "Whispers in the Wind",
                  author: "Robert Hayes",
                  price: 19.99,
                },
              ].map((b) => (
                <div
                  key={b.id}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="h-48 bg-gray-100">
                    <img
                      src={b.cover}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{b.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{b.author}</p>
                    <p className="font-bold mb-3">${b.price.toFixed(2)}</p>
                    <div className="flex space-x-2">
                      <Link
                        href="/cart"
                        className="bg-[#E3B23C] text-white px-3 py-1 rounded text-sm flex-grow text-center"
                      >
                        Add to Cart
                      </Link>
                      <button className="border border-gray-300 px-2 py-1 rounded text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "reviews":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
            <div className="space-y-6">
              {[
                {
                  cover:
                    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
                  title: "Midnight Gardens",
                  author: "James Holloway",
                  stars: 4,
                  text:
                    "A captivating story with beautiful prose. The pace slowed mid-story, but the ending thrilled.",
                  date: "June 30, 2023",
                },
                {
                  cover:
                    "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?auto=format&fit=crop&w=800&q=80",
                  title: "The Last Kingdom",
                  author: "Victoria Stone",
                  stars: 5,
                  text:
                    "One of the best fantasy novels I've read in years! The world-building is exceptional.",
                  date: "May 15, 2023",
                },
              ].map((r, i) => (
                <div key={i} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-start">
                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                      <img
                        src={r.cover}
                        alt={r.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold">{r.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by {r.author}
                      </p>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, j) => (
                          <StarIcon
                            key={j}
                            size={16}
                            className={
                              j < r.stars
                                ? "text-[#E3B23C]"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm mb-1">{r.text}</p>
                      <p className="text-xs text-gray-500">Posted on {r.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "settings":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            {/** Personal Info */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {["First Name", "Last Name", "Email", "Phone"].map((label, i) => (
                  <div key={i}>
                    <label className="block text-gray-700 text-sm mb-1">
                      {label}
                    </label>
                    <input
                      type={label === "Email" ? "email" : "text"}
                      className="w-full border rounded p-2"
                      defaultValue={
                        label === "First Name"
                          ? "Anish"
                          : label === "Last Name"
                          ? "jaiswal"
                          : label === "Email"
                          ? "allozpats32@gmail.com"
                          : "9800000000"
                      }
                    />
                  </div>
                ))}
              </div>
              <button className="bg-[#E3B23C] text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </div>
            {/** Preferences */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="font-bold mb-4">Preferences</h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-1">
                  Default Store
                </label>
                <select className="w-full border rounded p-2">
                  <option>BookLux </option>
                  <option>BookLux Downtown</option>
                  <option>BookLux University</option>
                </select>
              </div>
              {["Email notifications for new releases", "SMS notifications for order updates"].map((text, i) => (
                <div key={i} className="flex items-center mb-4">
                  <input type="checkbox" id={`pref${i}`} className="mr-2" defaultChecked={i===0}/>
                  <label htmlFor={`pref${i}`}>{text}</label>
                </div>
              ))}
              <button className="bg-[#E3B23C] text-white px-4 py-2 rounded">
                Save Preferences
              </button>
            </div>
            {/** Password */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-bold mb-4">Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {["Current Password", "New Password", "Confirm New Password"].map((label, i) => (
                  <div key={i}>
                    <label className="block text-gray-700 text-sm mb-1">
                      {label}
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded p-2"
                    />
                  </div>
                ))}
              </div>
              <button className="bg-[#E3B23C] text-white px-4 py-2 rounded">
                Update Password
              </button>
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
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#2C3E50] rounded-full flex items-center justify-center text-white text-lg font-bold mr-4">
                 AJ
                  </div>
                  <div>
                    <h3 className="font-bold">{user?.userName} </h3>
                    <p className="text-sm text-[#E3B23C]">Gold Member</p>
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
                      activeTab === key
                        ? "bg-[#fdf7e6] text-[#E3B23C]"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => SignOut()}
                  className="flex items-center w-full px-4 py-2 rounded text-left text-red-500 hover:bg-gray-100"
                >
                  <LogOutIcon size={18} className="mr-3" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="w-full md:w-3/4">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
