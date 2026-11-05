"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { AdminView } from "@/features/erp/views/admin";
import type { User as ApiUser } from "@/lib/types";

export default function AdminPage() {
  const { user } = useAuth();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const activeUser = user ?? (reduxUser ? (reduxUser as unknown as ApiUser) : null);
  const { showToast } = useApp();

  return (
    <div className="screen-wrapper">
      <AdminView currentUser={activeUser} showToast={showToast} />
    </div>
  );
}
