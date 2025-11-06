// src/pages/UserTopupPage.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

interface IPackage {
  id: number;
  name: string;
  coins: number;
  price: number;
  status?: "active" | "inactive";
  qr_url: string;
}

interface ITransaction {
  id: number;
  package_id: number;
  amount: number;
  money: number;
  slip_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const UserTopupPage: React.FC = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  // โหลดเฉพาะ active packages
  const loadPackages = async () => {
    try {
      const res = await api.get("/api/packages");
      const active = res.data.filter((p: IPackage) => p.status === "active");
      setPackages(active);
    } catch (err) {
      console.error("Failed to load packages");
    }
  };

  // โหลดประวัติการเติมเงินของ user
  const loadTransactions = async () => {
    try {
      const res = await api.get("/api/transactions/user");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions");
    }
  };

  useEffect(() => {
    loadPackages();
    loadTransactions();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlipFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageId) return setMessage("Please select a package");
    if (!slipFile) return setMessage("Please upload your slip");

    const formData = new FormData();
    formData.append("package_id", String(selectedPackageId));
    formData.append("slip", slipFile);

    try {
      const res = await api.post("/api/transactions/topup", formData);
      setMessage(res.data.message);
      setSlipFile(null);
      setSelectedPackageId(null);
      loadTransactions(); // รีเฟรชประวัติหลังเติม
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error uploading slip");
    }
  };

  return (
    <div className="container-fluid mt-4 d-flex">
      {/* Sidebar */}
      <Sidebar role="user" />

      {/* Main Content */}
      <div className="flex-grow-1 ms-3">
        <h3 className="mb-4">Top-Up Coins</h3>
        {message && <div className="alert alert-info">{message}</div>}

        {/* Form เติมเหรียญ */}
        <div className="card shadow-sm p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Select Package</label>
              <select
                className="form-select"
                value={selectedPackageId || ""}
                onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                required
              >
                <option value="">-- Select Package --</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.coins} Coins - ฿{pkg.price}
                  </option>
                ))}
              </select>
            </div>

            {selectedPackageId && (
              <div className="mb-3 text-center">
                <p className="fw-bold mb-1">Scan this QR to pay:</p>
                <img
                  src={`http://localhost:5000${
                    packages.find((p) => p.id === selectedPackageId)?.qr_url || ""
                  }`}
                  alt="QR Code"
                  style={{
                    width: 200,
                    height: 200,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                  }}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Upload Slip</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
                required
              />
            </div>

            {slipFile && (
              <div className="mb-3 text-center">
                <label className="form-label">Slip Preview</label>
                <br />
                <img
                  src={URL.createObjectURL(slipFile)}
                  alt="Slip Preview"
                  style={{ width: 150, borderRadius: 8, border: "1px solid #ccc" }}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              Submit Top-Up
            </button>
          </form>
        </div>

        {/* ประวัติการเติมเหรียญ */}
        <div className="card shadow-sm p-3">
          <h5>Your Top-Up History</h5>
          <div className="table-responsive mt-3">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Package</th>
                  <th>Coins</th>
                  <th>Amount (฿)</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Slip</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const pkg = packages.find((p) => p.id === tx.package_id);
                    return (
                      <tr key={tx.id}>
                        <td>{tx.id}</td>
                        <td>{pkg?.name || "-"}</td>
                        <td>{tx.amount}</td>
                        <td>{tx.money}</td>
                        <td>
                          <span
                            className={`badge ${
                              tx.status === "pending"
                                ? "bg-warning"
                                : tx.status === "approved"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td>{new Date(tx.created_at).toLocaleString()}</td>
                        <td>
                          {tx.slip_url ? (
                            <a
                              href={`http://localhost:5000${tx.slip_url}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={`http://localhost:5000${tx.slip_url}`}
                                alt="Slip"
                                style={{
                                  width: 100,
                                  borderRadius: 4,
                                  border: "1px solid #ccc",
                                }}
                              />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTopupPage;
