"use client";
import AddbannerModal from "@/components/SharedModals/AddBannerModal";
import { Button } from "antd";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import BannerManagement from "./BannerList";

const BannerPage = () => {
  const [showCreatebannerModal, setShowCreatebannerModal] = useState(false);
  return (
    <div>
      {/* =====================================Add banner button=================================== */}
      <div>
        <Button
          type="primary"
          size="large"
          icon={<PlusCircle size={20} />}
          iconPosition="start"
          className="!w-full !py-6"
          onClick={() => setShowCreatebannerModal(true)}
          style={{
            background: "linear-gradient(80deg, #FF9D53 0%, #CD5EA7 100%)",
          }}
        >
          Add Banner
        </Button>
      </div>

      {/* =====================================Banner list=================================== */}

      <div>
        <BannerManagement />
      </div>
      <AddbannerModal
        open={showCreatebannerModal}
        setOpen={setShowCreatebannerModal}
      />
    </div>
  );
};

export default BannerPage;
