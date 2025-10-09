"use client";
import Image from "next/image";
import { ImagePlus } from "lucide-react";

import { Tabs } from "antd";
import { ConfigProvider } from "antd";
import ChangePassForm from "./ChangePassForm";
import EditProfileForm from "./EditProfileForm";
import {
  useGetAdminQuery,
  useUploadAdminImageMutation,
} from "@/redux/api/admin";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";
import { jwtDecode } from "jwt-decode";

const { TabPane } = Tabs;

export default function ProfileContainer() {
  // get admin data
  const { data, isLoading } = useGetAdminQuery();
  const admin = data?.data || {};

  const token = useSelector(selectToken);
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken?.role;

  // upload admin image
  const [uploadAdminImage, { isLoading: isUploading }] =
    useUploadAdminImageMutation();
  // State to store the uploaded image
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadAdminImage(formData).unwrap();
      if (res.success) {
        toast.success("Image uploaded successfully");
        setSelectedImage(file);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  if (isLoading) {
    return (
      <div className="flex min-h-screen min-w-[400px] items-center justify-center rounded-xl bg-white p-6 shadow-lg">
        Loading...
      </div>
    );
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1b71a7" } }}>
      <div className="mx-auto w-full px-5 lg:w-3/4 lg:px-0 2xl:w-1/2">
        {/* Profile pic */}
        <section className="flex-center gap-x-3">
          <div className="relative w-max">
            <Image
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : admin?.image
              }
              alt="Admin avatar"
              width={1200}
              height={1200}
              className="border-primary-pink aspect-square h-auto w-[160px] rounded-full border-2 p-1"
            />

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Edit button */}
            <button
              onClick={triggerFileInput}
              className="flex-center absolute bottom-2 right-2 aspect-square rounded-full bg-[#2C50ED] p-2 text-white/95"
            >
              <ImagePlus size={20} />
            </button>
          </div>

          <div>
            <h3 className="text-3xl font-semibold">{admin?.name}</h3>
            <p className="mt-1 text-lg font-medium text-primary-blue">
              {userRole}
            </p>
            {/* <p>Selected Image: {selectedImage ? selectedImage.name : 'None'}</p> */}
          </div>
        </section>

        {/* Profile Information Forms */}
        <section className="my-16">
          <Tabs defaultActiveKey="editProfile" centered>
            <TabPane tab="Edit Profile" key="editProfile">
              <EditProfileForm admin={admin} />
            </TabPane>

            <TabPane tab="Change Password" key="changePassword">
              <ChangePassForm />
            </TabPane>
          </Tabs>
        </section>
      </div>
    </ConfigProvider>
  );
}
