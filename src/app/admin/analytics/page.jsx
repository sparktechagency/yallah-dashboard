import React from "react";
import AnalyticsContainer from "./_Component/AnalyticsContainer";

export const metadata = {
  title: "Analytics",
  description: "Admin analytics page",
};

function page() {
  return (
    <div>
      <AnalyticsContainer />
    </div>
  );
}

export default page;
