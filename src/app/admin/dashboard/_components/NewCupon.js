"use client";

import { ConfigProvider } from "antd";
import Image from "next/image";
import storelogo from "@/assets/brand/amazon-dark 1.svg";

// Dummy Data
const data = Array.from({ length: 3 }).map((_, inx) => ({
  Cupnname: "20% OFF Everything",
  storeImage: storelogo,
}));

const NewCuponeTable = ({ data }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
          colorInfo: "#1B70A6",
        },
      }}
    >
      <div className="min-h-[420px] w-1/2 rounded-xl bg-white p-6 shadow-md xl:w-1/2">
        <h1 className="text-xl font-semibold text-primary-blue">New Coupon</h1>
        <p className="mb-5 text-sm text-gray-500">
          Here is the list of recently added coupons. You can view details or
          edit them as needed.
        </p>

        <div>
          {data.length > 0 ? (
            data.map((cupon) => (
              <div key={cupon.Cupnname} className="mb-4 flex flex-col gap-4">
                <div className="mb-4 flex justify-start gap-4">
                  <Image
                    src={cupon?.store?.image}
                    alt="Store"
                    className="h-12 w-12 object-cover"
                    height={400}
                    width={400}
                  />
                  <div>
                    <span className="text-lg font-medium text-primary-blue">
                      {cupon?.title}
                    </span>
                    <p className="text-sm text-gray-500">
                      {cupon?.store?.name}
                    </p>
                  </div>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent coupons found.</p>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default NewCuponeTable;
