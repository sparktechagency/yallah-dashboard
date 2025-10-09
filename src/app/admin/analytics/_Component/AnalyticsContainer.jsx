import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import Image from "next/image";
import React from "react";
import icon1 from "@/assets/images/staticsicon1.png";
import icon2 from "@/assets/images/staticsicon2.png";
import AnalyticsTable from "./AnalyticsTable";
import AppAnalyticsComponent from "./AppleAndPlayStoreData";

const AnalyticsContainer = () => {
  const cuponeStats = [
    {
      key: "users",
      title: "Total Coupons Copied",
      icon: icon2,
      count: 518,
    },
    {
      key: "cupon",
      title: "Active Coupons ",
      icon: icon1,
      count: 118,
    },
    {
      key: "cupon",
      title: "Total Cupons",
      icon: icon1,
      count: 118,
    },
    {
      key: "cupon",
      title: "Total Cupons",
      icon: icon1,
      count: 118,
    },
    {
      key: "cupon",
      title: "Total Cupons",
      icon: icon1,
      count: 118,
    },
  ];
  return (
    <div>
      {/* User Stats Section */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-3">
        {cuponeStats?.map((stat) => (
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
                className={`flex aspect-square !w-20 items-center justify-center rounded-full ${
                  stat.key === "cupon"
                    ? "bg-gradient-to-tr from-[#ffffff] to-[#f0e9e3]"
                    : "bg-gradient-to-tr from-[#de54b1] to-[#FFD6B3]"
                }`}
              >
                <Image src={stat.icon} alt={stat.title} className="h-10 w-10" />
              </div>
            </div>
          </div>
        ))}
      </section>
      {/* =================AnalyticsTable ================ */}
      <section className="mt-10">
        <AnalyticsTable />
      </section>
      <section className="mt-10">
        <AppAnalyticsComponent />
      </section>
    </div>
  );
};

export default AnalyticsContainer;
