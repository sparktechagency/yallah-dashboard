"use client";
import { Button } from "antd";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import AddThumbnailModal from "./AddThumbnailForm";
import ThumbnailList from "./ThumbnailList";

const ThumbnailContainer = () => {
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
          Add Thumbnail
        </Button>
      </div>

      <ThumbnailList />

      <AddThumbnailModal
        open={showCreatebannerModal}
        setOpen={setShowCreatebannerModal}
      />
    </div>
  );
};

export default ThumbnailContainer;
