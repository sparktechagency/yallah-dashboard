"use client";
import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import EarningSummary from "./Earnings";
import NewCuponeTable from "./NewCupon";
import RecentUserTable from "./RecentUserTable";
import { Crown, User } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";
import { useGetDashboardDataQuery } from "@/redux/api/dashboardApi";
import { Skeleton } from "antd";

export default function DashboardContainer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const token = useSelector(selectToken);
  const [params, setParams] = useState({
    year: new Date().getFullYear(),
  });

  const { data, isLoading, isError } = useGetDashboardDataQuery(params, {
    skip: !token,
  });

  // Dummy Data
  const userStats = [
    {
      key: "users",
      title: "Total Users",
      icon: <User />,
      count: data?.data?.totalUsers || 0,
    },
    {
      key: "cupon",
      title: "Total Cupons",
      icon: <Crown />,
      count: data?.data?.totalCoupons || 0,
    },
  ];

  if (isLoading)
    return (
      <div className="space-y-20">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-2 2xl:grid-cols-2">
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "120px" }}
            block={true}
          />
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "120px" }}
            block={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-2 2xl:grid-cols-2">
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "320px" }}
            block={true}
          />
          <Skeleton.Button
            active={true}
            size={"100px"}
            shape={"square"}
            style={{ height: "320px" }}
            block={true}
          />
        </div>
      </div>
    );
  if (isError) return <div>Error Fetching Data</div>;

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };
  return (
    <div className="space-y-20">
      {/* User Stats Section */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-2 2xl:grid-cols-2">
        {userStats?.map((stat) => (
          <div
            key={stat.key}
            className="gap-x-4 rounded-2xl bg-[#FFFFFF] p-5 text-black shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-dmSans text-lg font-medium text-gray-400">
                  {stat.title}
                </p>
                <h5 className="mt-0.5 text-3xl font-semibold text-primary-blue">
                  {stat.key !== "earning" ? (
                    <CustomCountUp end={stat.count} />
                  ) : (
                    <span>
                      $<CustomCountUp end={stat.count} />
                    </span>
                  )}
                </h5>
              </div>
              <div
                className={`flex aspect-square !w-20 items-center justify-center rounded-full !text-2xl ${
                  stat.key === "cupon"
                    ? "bg-gradient-to-tr from-[#c8c4c4] to-[#ffff] !text-2xl text-pink-400"
                    : "bg-gradient-to-tr from-[#de54b1] to-[#FFD6B3] !text-2xl text-white"
                }`}
              >
                <p className="font-bol text-2xl">{stat.icon} </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="flex-center-between flex-col gap-10 xl:flex-row">
        <EarningSummary
          earningSummary={data?.data?.userSummary || []}
          onFilterChange={setParams}
        />
        <NewCuponeTable data={data?.data?.newCoupons || []} />
      </section>

      {/* Recent Users Table */}
      <section>
        <RecentUserTable />
      </section>
    </div>
  );
}
