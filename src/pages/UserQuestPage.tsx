import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

interface IQuest {
  id: number;
  title: string;
  entry_fee: number;
  reward_1: number;
  reward_2: number;
  reward_3: number;
  status: "open" | "closed";
  start_date: string | null;
  end_date: string | null;
}

const UserQuestPage: React.FC = () => {
  const [quests, setQuests] = useState<IQuest[]>([]);
  const [message, setMessage] = useState("");

  const loadQuests = async () => {
    try {
      const res = await api.get("/api/quests/active");
      setQuests(res.data);
    } catch (err) {
      console.error("Failed to load quests");
      setMessage("Failed to load quests");
    }
  };

  useEffect(() => {
    loadQuests();
  }, []);

  const joinQuest = async (id: number) => {
    try {
      const res = await api.post(`/api/quests/${id}/join`);
      setMessage(res.data.message || "Successfully joined the quest!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error joining quest");
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  return (
    <div className="container-fluid mt-4 d-flex">
      <Sidebar role="user" />
      <div className="flex-grow-1 ms-3">
        <h3>Join Quests</h3>
        {message && <div className="alert alert-info mt-2">{message}</div>}

        <div className="card shadow-sm p-3 mt-3">
          {quests.length === 0 ? (
            <div className="text-center text-muted p-4">
              No active quests available.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Entry Fee</th>
                    <th>Rewards</th>
                    <th>Status</th>
                    <th>Dates</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quests.map((q) => (
                    <tr key={q.id}>
                      <td>{q.id}</td>
                      <td>{q.title}</td>
                      <td>{q.entry_fee}</td>
                      <td>
                        {q.reward_1}/{q.reward_2}/{q.reward_3}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            q.status === "open" ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td>
                        {formatDate(q.start_date)} - {formatDate(q.end_date)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => joinQuest(q.id)}
                          disabled={q.status !== "open"}
                        >
                          Join
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserQuestPage;
