"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { AdminView } from "@/features/erp/views/admin";

export default function AdminPage() {
  const { user } = useAuth();
  const { showToast } = useApp();

  return (
    <div className="screen-wrapper">
      <AdminView currentUser={user} showToast={showToast} />
    </div>
  );
}
