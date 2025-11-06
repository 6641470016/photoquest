// src/pages/admin/AdminPackagePage.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

interface IPackage {
  id: number;
  name: string;
  coins: number;
  price: number;
  qr_url: string;
  status?: "active" | "inactive";
}

const AdminPackagePage: React.FC = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    coins: 0,
    price: 0,
    qrFile: null as File | null,
  });
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadPackages = async () => {
    try {
      const res = await api.get("/api/packages/all");
      setPackages(res.data);
    } catch (err) {
      console.error("Failed to load packages");
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, qrFile: file });
    setQrPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.coins || !form.price) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("coins", String(form.coins));
    formData.append("price", String(form.price));
    if (form.qrFile) formData.append("qr", form.qrFile);
    if (form.id) formData.append("id", String(form.id));

    try {
      if (form.id) {
        await api.put("/api/packages", formData);
        setMessage("Package updated successfully");
      } else {
        await api.post("/api/packages", formData);
        setMessage("Package created successfully");
      }
      setForm({ id: 0, name: "", coins: 0, price: 0, qrFile: null });
      setQrPreview(null);
      loadPackages();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error saving package");
    }
  };

  const handleEdit = (pkg: IPackage) => {
    setForm({ id: pkg.id, name: pkg.name, coins: pkg.coins, price: pkg.price, qrFile: null });
    setQrPreview(`http://localhost:5000${pkg.qr_url}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure to delete this package?")) return;
    try {
      await api.delete(`/api/packages/${id}`);
      setMessage("Package deleted successfully");
      loadPackages();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error deleting package");
    }
  };

  const toggleStatus = async (pkg: IPackage) => {
    if (!pkg.id) return;
    try {
      await api.patch(`/api/packages/${pkg.id}/status`);
      loadPackages();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error updating status");
    }
  };

  return (
    <div className="container-fluid mt-4 d-flex">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <div className="flex-grow-1 ms-3">
        <h3 className="mb-3">Manage Packages</h3>
        {message && <div className="alert alert-info">{message}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label>Name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label>Coins</label>
            <input
              type="number"
              className="form-control"
              value={form.coins}
              onChange={e => setForm({ ...form, coins: Number(e.target.value) })}
              required
            />
          </div>

          <div className="mb-3">
            <label>Price (฿)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={form.price}
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
          </div>

          <div className="mb-3">
            <label>QR Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          {qrPreview && (
            <div className="mb-3">
              <label>Preview:</label>
              <br />
              <img src={qrPreview} alt="QR Preview" style={{ width: 120 }} />
            </div>
          )}

          <button className="btn btn-success mb-3" type="submit">
            {form.id ? "Update" : "Create"}
          </button>
        </form>

        {/* Packages Table */}
        <h5>All Packages</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Coins</th>
              <th>Price</th>
              <th>Status</th>
              <th>QR</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.coins}</td>
                <td>{p.price}</td>
                <td>{p.status}</td>
                <td>
                  <img
                    src={`http://localhost:5000${p.qr_url}`}
                    alt="QR"
                    style={{ width: 80 }}
                  />
                </td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(p.id)}>Delete</button>
                  <button className="btn btn-warning btn-sm" onClick={() => toggleStatus(p)}>
                    {p.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPackagePage;
