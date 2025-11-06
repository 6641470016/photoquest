// src/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  role: "admin" | "user";
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  return (
    <div
      className="bg-light p-3 shadow-sm"
      style={{
        flex: "0 0 20%",
        borderRadius: 8,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <h5 className="mb-4 text-primary fw-bold">
        {role === "admin" ? "Admin Menu" : "User Menu"}
      </h5>
      <ul className="nav flex-column">
        {role === "admin" ? (
          <>
            <li className="nav-item mb-2">
              <Link
                to="/dashboard/admin"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-house-door me-2"></i> Dashboard Home
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/admin/packages"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-box-seam me-2"></i> Manage Packages
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/admin/topups"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-check2-square me-2"></i> Approve Top-Ups
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/admin/quests"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-trophy me-2"></i> Manage Quests
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item mb-2">
              <Link
                to="/dashboard/user"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-house-door me-2"></i> Dashboard Home
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link
                to="/user/topup"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-cash-stack me-2"></i> Top-Up Coins
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link
                to="/user/quests"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-trophy me-2"></i> Join Quests
              </Link>
            </li>

            {/* ✅ Upload Photo */}
            <li className="nav-item mb-2">
              <Link
                to="/user/upload-photo"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-upload me-2"></i> Upload Photo
              </Link>
            </li>

            {/* ✅ Photo Gallery */}
            <li className="nav-item mb-2">
              <Link
                to="/user/gallery"
                className="nav-link d-flex align-items-center btn btn-light w-100 text-start border mb-1"
                style={{ borderRadius: "6px" }}
              >
                <i className="bi bi-images me-2"></i> Photo Gallery
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
