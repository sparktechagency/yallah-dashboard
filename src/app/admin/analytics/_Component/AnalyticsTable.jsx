import { Table } from "antd";
import React from "react";

const AnalyticsTable = () => {
  const data = Array.from({ length: 4 }, (_, key) => ({
    key,
    Platform: "Amazon",
    Spend: "$1000",
    Installs: "1000",
    Clicks: "1000",
    CPI: "1000",
  }));
  const columns = [
    { title: "Platform", dataIndex: "Platform" },
    { title: "Spend", dataIndex: "Spend" },
    { title: "Installs", dataIndex: "Installs" },
    { title: "Clicks", dataIndex: "Clicks" },
    { title: "CPI", dataIndex: "CPI" },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default AnalyticsTable;
