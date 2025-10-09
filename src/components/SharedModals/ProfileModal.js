"use client";

import { Image } from "antd";
import {
  X,
  Mail,
  Copy,
  MapPin,
  Phone,
  CheckCircle,
  Star,
  Shield,
  Crown,
} from "lucide-react";

export default function ProfileModals({ open, setOpen, user }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="animate-in fade-in-0 zoom-in-95 relative mx-4 w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200/50 bg-gradient-to-br from-[#f3d4d4] via-white to-[#f3d4d4] shadow-2xl backdrop-blur-xl duration-500">
        <div className="relative flex items-center justify-between border-b border-gray-200/50 bg-gradient-to-r from-gray-50/20 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="animate-pulse rounded-xl border border-blue-500/20 bg-blue-500/10 p-2">
              <Crown className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent">
              {user?.name} Details
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="group rounded-xl p-2 transition-all duration-300 hover:rotate-90 hover:bg-gray-100/50"
          >
            <X className="h-5 w-5 text-gray-500 transition-colors group-hover:text-gray-900" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="relative p-6">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 p-1">
                <div className="h-full w-full rounded-full bg-white"></div>
              </div>
              <Image
                src={user?.userImg}
                alt="User Image"
                className="relative z-10 h-28 w-28 rounded-full border-4 border-white object-cover shadow-2xl"
                width={130}
                height={130}
              />
              <div className="border-3 absolute -right-2 -top-2 flex h-8 w-8 animate-spin items-center justify-center rounded-full border-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                <Star className="h-4 w-4 fill-current text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-emerald-500 to-orange-500 shadow-lg">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
            <h3 className="mb-2 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              {user?.name || "No Name"}
            </h3>
            <p className="rounded-full border border-gray-200/30 bg-gray-100/30 px-4 py-1 text-sm font-medium text-gray-600">
              {user?.email || "No email provided"}
            </p>
          </div>

          <div className="mb-8 space-y-3">
            <div className="group flex items-center gap-4 rounded-2xl border border-gray-200/30 bg-gradient-to-r from-gray-100/30 to-gray-50/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-gray-200/50 hover:from-gray-100/50 hover:to-gray-50/20 hover:shadow-lg">
              <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.email || "No email provided"}
                </p>
                <p className="text-xs text-gray-600">Primary Email</p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl border border-gray-200/30 bg-gradient-to-r from-gray-100/30 to-gray-50/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-gray-200/50 hover:from-gray-100/50 hover:to-gray-50/20 hover:shadow-lg">
              <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
                <Copy className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Copied coupon</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900">
                    {user?.copiedCupon || 0}
                  </p>
                  <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600">
                    times
                  </span>
                </div>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl border border-gray-200/30 bg-gradient-to-r from-gray-100/30 to-gray-50/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-gray-200/50 hover:from-gray-100/50 hover:to-gray-50/20 hover:shadow-lg">
              <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Country</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.country || "Not Provided"}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl border border-gray-200/30 bg-gradient-to-r from-gray-100/30 to-gray-50/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-gray-200/50 hover:from-gray-100/50 hover:to-gray-50/20 hover:shadow-lg">
              <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/20 to-orange-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
                <Phone className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.phone || "Not Provided"}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl border border-gray-200/30 bg-gradient-to-r from-gray-100/30 to-gray-50/10 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-gray-200/50 hover:from-gray-100/50 hover:to-gray-50/20 hover:shadow-lg">
              <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Account status</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                    <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                    {user?.status || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
