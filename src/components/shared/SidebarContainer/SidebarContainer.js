"use client";

import "./Sidebar.css";
import logo from "@/assets/images/logo.png";
import { logout, selectToken } from "@/redux/features/authSlice";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { jwtDecode } from "jwt-decode";
import {
  Bell,
  Plus,
  BadgeJapaneseYen,
  Store,
  ChartNetwork,
  ScrollText,
  LogOut,
  SlidersVertical,
  CircleUser,
  House,
  List,
  GalleryThumbnails,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const SidebarContainer = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [currentPathname, setCurrentPathname] = useState("dashboard");
  const token = useSelector(selectToken);
  const storedRole = token ? jwtDecode(token) : null;
  const [role, setRole] = useState(storedRole);

  // Update currentPathname on client side
  useEffect(() => {
    if (pathname) {
      const path =
        pathname?.replace("/admin/", "")?.split("/")[0] || "dashboard";
      setCurrentPathname(path);
    }
  }, [pathname]);

  // Logout handler
  const onClick = (e) => {
    if (e.key === "logout") {
      dispatch(logout());
      router.refresh();
      router.push("/login");
      toast.success("Logout Successfully");
    }
  };

  const navLinks = {
    Admin: [
      {
        key: "dashboard",
        icon: <House size={21} strokeWidth={2} />,
        label: <Link href="/admin/dashboard">Dashboard</Link>,
      },
      {
        key: "account-details",
        icon: <CircleUser size={21} strokeWidth={2} />,
        label: <Link href="/admin/account-details">User Details</Link>,
      },
      {
        key: "banner",
        icon: <Plus size={21} strokeWidth={2} />,
        label: <Link href="/admin/addbanner"> Banner Setting</Link>,
      },
      {
        key: "thumbnail",
        icon: <GalleryThumbnails size={21} strokeWidth={2} />,
        label: <Link href="/admin/addthumbnail"> Thumbnail Setting</Link>,
      },
      {
        key: "popup-management",
        icon: <GalleryThumbnails size={21} strokeWidth={2} />,
        label: <Link href="/admin/popup-management"> Popup Management</Link>,
      },
      {
        key: "coupon-management",
        icon: <BadgeJapaneseYen size={21} strokeWidth={2} />,
        label: <Link href="/admin/coupon-management">Coupon Management</Link>,
      },
      {
        key: "store-management",
        icon: <Store size={21} strokeWidth={2} />,
        label: <Link href="/admin/store-management">Store Management</Link>,
      },
      {
        key: "category-management",
        icon: <List size={21} strokeWidth={2} />,
        label: <Link href="/admin/category">Category Management</Link>,
      },
      // {
      //   key: "coupon-tracking",
      //   icon: <RailSymbol size={21} strokeWidth={2} />,
      //   label: <Link href="/admin/coupon-tracking">Coupon Tracking</Link>,
      // },
      {
        key: "analytics",
        icon: <ChartNetwork size={21} strokeWidth={2} />,
        label: <Link href="/admin/analytics">Analytics</Link>,
      },
      {
        key: "push-notifications",
        icon: <Bell size={21} strokeWidth={2} />,
        label: <Link href="/admin/push-notifications">Push Notifications</Link>,
      },
      {
        key: "manage-editor-and-viewer",
        icon: <Plus size={21} strokeWidth={2} />,
        label: (
          <Link href="/admin/manage-editor-and-viewer">
            Add Editor And Viewer
          </Link>
        ),
      },
      {
        key: "settings",
        icon: <SlidersVertical size={21} strokeWidth={2} />,
        label: "Settings",
        children: [
          {
            key: "privacy-policy",
            icon: <ScrollText size={21} strokeWidth={2} />,
            label: <Link href="/admin/privacy-policy">Privacy Policy</Link>,
          },
          {
            key: "terms-conditions",
            icon: <ScrollText size={21} strokeWidth={2} />,
            label: (
              <Link href="/admin/terms-conditions">Terms & Conditions</Link>
            ),
          },
        ],
      },
      {
        key: "logout",
        icon: <LogOut size={21} strokeWidth={2} />,
        label: <Link href="/login">Logout</Link>,
      },
    ],
    Editor: [
      {
        key: "coupon-management",
        icon: <BadgeJapaneseYen size={21} strokeWidth={2} />,
        label: <Link href="/admin/coupon-management">Coupon Management</Link>,
      },
      {
        key: "push-notifications",
        icon: <Bell size={21} strokeWidth={2} />,
        label: <Link href="/admin/push-notifications">Push Notifications</Link>,
      },
      {
        key: "logout",
        icon: <LogOut size={21} strokeWidth={2} />,
        label: <Link href="/login">Logout</Link>,
      },
    ],
    Viewer: [
      {
        key: "coupon-management",
        icon: <BadgeJapaneseYen size={21} strokeWidth={2} />,
        label: <Link href="/admin/coupon-management">Coupon Management</Link>,
      },
      {
        key: "push-notifications",
        icon: <Bell size={21} strokeWidth={2} />,
        label: <Link href="/admin/push-notifications">Push Notifications</Link>,
      },
      {
        key: "logout",
        icon: <LogOut size={21} strokeWidth={2} />,
        label: <Link href="/login">Logout</Link>,
      },
    ],
  };
  const links = navLinks[role?.role] || [];
  return (
    <Sider
      width={320}
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        paddingInline: collapsed ? "4px" : "10px",
        paddingBlock: "30px",
        backgroundColor: "#FFFCFC",
        height: "100vh", // Use height instead of maxHeight
        position: "fixed", // Fix sidebar to prevent shifting
        overflowY: "auto", // Allow scrolling within sidebar
      }}
      className="scroll-hide"
    >
      <div className="mb-6 flex flex-col items-center justify-center gap-y-5">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo Of Before After Story"
            width={collapsed ? 40 : 200} // Fixed width for consistency
            height={collapsed ? 16 : 104} // Fixed height for consistency
            className="transition-none" // Prevent transition animation
            priority // Preload image to avoid layout shift
          />
        </Link>
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={[currentPathname]} // Use selectedKeys instead of defaultSelectedKeys
        mode="inline"
        className="sidebar-menu space-y-2.5 !border-none !bg-transparent"
        items={links}
      />
    </Sider>
  );
};

export default SidebarContainer;
