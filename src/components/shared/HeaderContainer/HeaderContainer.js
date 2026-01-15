"use client";

import { Button } from "antd";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import userAvatar from "@/assets/images/nouser.png";
import { usePathname } from "next/navigation";
import { Layout } from "antd";
import { AlignJustify } from "lucide-react";
// import { LanguageSwitcher } from "@/components/LangSwitcher/lang-switcher";
import { useEffect, useState } from "react";
import { useGetAdminQuery } from "@/redux/api/admin";
const { Header } = Layout;

export default function HeaderContainer({ collapsed, setCollapsed }) {
  const pathname = usePathname() || "/admin";
  const [navbarTitle, setNavbarTitle] = useState("dashboard");
  // get admin data
  const { data } = useGetAdminQuery();
  const admin = data?.data || {};

  useEffect(() => {
    const title = pathname.split("/admin")[1];
    setNavbarTitle(
      title?.length > 1
        ? title.replaceAll("/", " ").replaceAll("-", " ")
        : "dashboard",
    );
  }, [pathname]);

  return (
    <Header
      style={{
        backgroundColor: "#FFFFFF",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 0,
        paddingRight: "40px",
        position: "fixed",
        zIndex: 10,

        top: 0,
        width: `calc(85% - ${collapsed ? -210 : 0}px)`,
        // zIndex: 100,
        boxShadow: "0 2px 8px #f0f1f2",
        borderBottom: "1px solid lightGray",
      }}
    >
      <div className="flex items-center gap-x-2">
        <Button
          type="text"
          icon={<AlignJustify strokeWidth={3} size={25} />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <h1 className="-mt-3 font-dmSans text-xl font-semibold capitalize">
          {navbarTitle}
        </h1>
      </div>
      <div className="flex items-center gap-x-6">
        {/* <Link href="/admin/notification" className="relative !leading-none">
          <div className="absolute -right-1 -top-1.5 size-3 rounded-full bg-[#000000]" />
          <Bell fill="#1C1B1F" stroke="#1C1B1F" size={22} />
        </Link> */}
        <div>{/* <LanguageSwitcher /> */}</div>
        <Link
          href={"/admin/profile"}
          className="group flex items-center gap-x-2 text-black hover:text-primary-blue"
        >
          <Image
            src={admin?.image || userAvatar}
            alt="Admin avatar"
            width={52}
            height={52}
            className="aspect-square rounded-full border-2 border-primary-green p-0.5 group-hover:border"
          />
          <h4 className="text-lg font-semibold">{admin?.name || "Author"} </h4>
        </Link>
      </div>
    </Header>
  );
}
