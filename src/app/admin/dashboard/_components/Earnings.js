"use client";

import { DatePicker, Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const EarningSummary = ({ earningSummary, onFilterChange }) => {
  const [filterType, setFilterType] = useState("year");
  const [value, setValue] = useState(null);

  const handleDateChange = (date) => {
    if (!date) return;

    if (filterType === "year") {
      onFilterChange({
        year: date.year(),
      });
    }

    if (filterType === "week") {
      onFilterChange({
        weekStartDate: date.startOf("isoWeek").format("YYYY-MM-DD"),
      });
    }

    setValue(date);
  };

  const data =
    earningSummary?.map((item) => ({
      name: item.month || item.date,
      users: item.users,
    })) || [];

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-medium text-primary-blue">User Overview</h1>

        <div className="flex gap-2">
          <Select
            value={filterType}
            onChange={(v) => {
              setFilterType(v);
              setValue(null);
            }}
            options={[
              { label: "Yearly", value: "year" },
              { label: "Weekly", value: "week" },
            ]}
            style={{ width: 120 }}
          />

          <DatePicker
            picker={filterType}
            value={value}
            onChange={handleDateChange}
            placeholder={`Select ${filterType}`}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="users" fill="#de54b1" radius={5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningSummary;
