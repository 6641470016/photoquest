// src/pages/admin/TopUpApprovePage.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

interface ITransaction {
  id: number;
  user_name: string;
  package_name: string;
  amount: number;
  money: number;
  slip_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const TopUpApprovePage: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [message, setMessage] = useState("");

  const loadTransactions = async () => {
    try {
      const res = await api.get("/api/transactions/pending");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load pending transactions");
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const approve = async (id: number) => {
    try {
      await api.patch(`/api/transactions/${id}/approve`);
      setMessage("Transaction approved");
      loadTransactions();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error approving transaction");
    }
  };

  const reject = async (id: number) => {
    try {
      await api.patch(`/api/transactions/${id}/reject`);
      setMessage("Transaction rejected");
      loadTransactions();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error rejecting transaction");
    }
  };

  const renderStatusBadge = (status: ITransaction["status"]) => {
    const color =
      status === "pending" ? "warning" :
      status === "approved" ? "success" :
      "danger";

    return <span className={`badge bg-${color}`}>{status}</span>;
  };

  return (
    <div className="container-fluid mt-4 d-flex">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Main Content */}
      <div className="flex-grow-1 ms-3">
        <h3 className="mb-4">Approve Top-Ups</h3>
        {message && <div className="alert alert-info">{message}</div>}

        <div className="card shadow-sm p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Package</th>
                  <th>Coins</th>
                  <th>Price (฿)</th>
                  <th>Status</th>
                  <th>Slip</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center">No pending transactions</td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{tx.id}</td>
                      <td>{tx.user_name}</td>
                      <td>{tx.package_name}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.money}</td>
                      <td>{renderStatusBadge(tx.status)}</td>
                      <td>
                        {tx.slip_url ? (
                          <a href={`http://localhost:5000${tx.slip_url}`} target="_blank" rel="noreferrer">
                            <img
                              src={`http://localhost:5000${tx.slip_url}`}
                              alt="Slip"
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                              }}
                            />
                          </a>
                        ) : "-"}
                      </td>
                      <td>{new Date(tx.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-2 mb-1"
                          onClick={() => approve(tx.id)}
                          disabled={tx.status !== "pending"}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger mb-1"
                          onClick={() => reject(tx.id)}
                          disabled={tx.status !== "pending"}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpApprovePage;
