// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

interface IAdminWallet {
  total_coins: number;
  total_revenue: number;
  updated_at: string | null;
}

const AdminDashboard: React.FC = () => {
  const [wallet, setWallet] = useState<IAdminWallet | null>(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลจาก backend
  const loadWallet = async () => {
    try {
      const res = await api.get("/dashboard/admin");
      setWallet(res.data.wallet);
    } catch (err) {
      console.error("Failed to load admin wallet", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid mt-4 d-flex">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <div className="flex-grow-1 ms-3">
        <h3 className="mb-3">Welcome, Admin!</h3>
        <p className="lead">
          Monitor total coins and revenue, and manage top-ups, users, and quests.
        </p>

        {/* ✅ แสดงยอดรวมจากตาราง admin_wallet */}
        <div className="row mt-4">
          {/* Total Coins */}
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm h-100 border-success">
              <div className="card-body text-center">
                <h5 className="text-success">Total Coins in System</h5>
                <p
                  className="display-4 fw-bold mt-3 mb-2"
                  style={{ color: "#28a745" }}
                >
                  {wallet?.total_coins?.toLocaleString() ?? 0} 🪙
                </p>
                <p className="text-muted mb-1">
                  Last updated:{" "}
                  {wallet?.updated_at
                    ? new Date(wallet.updated_at).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm h-100 border-info">
              <div className="card-body text-center">
                <h5 className="text-info">Total Revenue</h5>
                <p
                  className="display-4 fw-bold mt-3 mb-2"
                  style={{ color: "#17a2b8" }}
                >
                  ฿
                  {wallet?.total_revenue?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? "0.00"}
                </p>
                <p className="text-muted mb-1">All-time accumulated revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>     
  );
};

export default AdminDashboard;
