"use client";

import HeaderContainer from "@/components/shared/HeaderContainer/HeaderContainer";
import SidebarContainer from "@/components/shared/SidebarContainer/SidebarContainer";
import { useMediaQuery } from "@react-hook/media-query";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const { Content } = Layout;

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const screenSizeLessThan1300 = useMediaQuery(
    "only screen and (max-width: 1300px)",
  );

  useEffect(() => {
    if (screenSizeLessThan1300 && !sidebarCollapsed) {
      const timer = setTimeout(() => {
        toast.success(
          "Small screen detected! If content doesn't fit better please collapse the sidebar by clicking the menu button on top-left",
          {
            duration: 2500,
            style: { marginTop: "80px" },
          },
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [screenSizeLessThan1300, sidebarCollapsed]);

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <SidebarContainer collapsed={sidebarCollapsed} />
      <Layout
        style={{
          marginLeft: sidebarCollapsed ? 80 : 320,
          transition: "margin-left 0.2s",
        }}
      >
        <HeaderContainer
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <Content
          style={{
            minHeight: "calc(100vh - 80px)",
            overflow: "auto",
            marginTop: 80,
            backgroundColor: "#F5F5F5",
            padding: "30px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
