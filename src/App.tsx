// frontend/src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from "./components/PrivateRoute";
import TopUpPage from "./pages/UserTopupPage";
import AdminPackagePage from "./pages/AdminPackagePage";
import TopUpApprovePage from "./pages/TopUpApprovePage";
import AdminQuestPage from "./pages/AdminQuestPage";
import UserQuestPage from "./pages/UserQuestPage";
import UploadPhoto from "./components/UploadPhoto"; 
import PhotoGallery from "./components/PhotoGallery"; // ✅ เพิ่ม import

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Router>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">PhotoQuest</Link>
          <div className="navbar-nav ms-auto">
            {!user && (
              <>
                <Link className="nav-link" to="/register">Register</Link>
                <Link className="nav-link" to="/login">Login</Link>
              </>
            )}
            {user && (
              <>
                <span className="nav-link">Hello, {user.display_name}</span>
                <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/packages"
          element={
            <PrivateRoute role="admin">
              <AdminPackagePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/topups"
          element={
            <PrivateRoute role="admin">
              <TopUpApprovePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quests"
          element={
            <PrivateRoute role="admin">
              <AdminQuestPage />
            </PrivateRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/dashboard/user"
          element={
            <PrivateRoute role="user">
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/topup"
          element={
            <PrivateRoute role="user">
              <TopUpPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/quests"
          element={
            <PrivateRoute role="user">
              <UserQuestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/upload-photo"
          element={
            <PrivateRoute role="user">
              <UploadPhoto />
            </PrivateRoute>
          }
        />
        {/* ✅ เพิ่มเส้นทางสำหรับ PhotoGallery */}
        <Route
          path="/user/gallery"
          element={
            <PrivateRoute role="user">
              <PhotoGallery />
            </PrivateRoute>
          }
        />

        {/* Default/Fallback Route */}
        <Route
          path="*"
          element={
            user ? (
              user.role === "admin" ? <AdminDashboard /> : <UserDashboard />
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
