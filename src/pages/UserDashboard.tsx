// src/pages/UserDashboard.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { Link } from "react-router-dom";

interface IUserInfo {
  id: number;
  display_name: string;
  email: string;
  coins: number;
}

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<IUserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล user จาก backend
  const loadUserInfo = async () => {
    try {
      const res = await api.get("/dashboard/user");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user info", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container-fluid mt-4 d-flex">
      {/* Sidebar */}
      <Sidebar role="user" />

      {/* Main Content */}
      <div className="flex-grow-1 ms-3">
        <h3 className="mb-3">Welcome, {user?.display_name || "User"}!</h3>
        <p className="lead">
          Manage your profile, view coin balance, and join exciting photo quests.
        </p>

        <div className="row mt-4">
          {/* Coin Balance */}
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm h-100 border-success">
              <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                <h5 className="card-title text-success">Your Coins</h5>
                <p className="display-3 fw-bold mt-3 mb-2" style={{ color: "#28a745" }}>
                  {user?.coins ?? 0} 🪙
                </p>
                <p className="card-text mb-3">
                  Coins can be used to join quests and unlock premium features.
                </p>
                <Link to="/user/topup" className="btn btn-success">
                  Top Up Coins
                </Link>
              </div>
            </div>
          </div>

          {/* Quests Section */}
          <div className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Photo Quests</h5>
                <p className="card-text flex-grow-1">
                  Compete in fun photography contests and win rewards!
                </p>
                <Link to="/user/quests" className="btn btn-primary mt-2">
                  View Quests
                </Link>
              </div>
            </div>
          </div>

         
          
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
