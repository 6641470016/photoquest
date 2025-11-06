// frontend/src/pages/AdminQuestPage.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

interface IQuest {
  id: number;
  title: string;
  description?: string;
  entry_fee: number;
  reward_1: number;
  reward_2: number;
  reward_3: number;
  total_pool: number;
  status: "open" | "closed" | "finished";
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

const AdminQuestPage: React.FC = () => {
  const [quests, setQuests] = useState<IQuest[]>([]);
  const [form, setForm] = useState<Omit<IQuest, "id" | "total_pool" | "created_at"> & { id?: number }>({
    id: undefined,
    title: "",
    description: "",
    entry_fee: 0,
    reward_1: 50,
    reward_2: 30,
    reward_3: 20,
    status: "open",
    start_date: "",
    end_date: "",
  });
  const [message, setMessage] = useState("");

  const loadQuests = async () => {
    try {
      const res = await api.get("/api/quests");
      setQuests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadQuests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/api/quests/${form.id}`, form);
        setMessage("Quest updated successfully");
      } else {
        await api.post("/api/quests", form);
        setMessage("Quest created successfully");
      }
      setForm({
        id: undefined,
        title: "",
        description: "",
        entry_fee: 0,
        reward_1: 50,
        reward_2: 30,
        reward_3: 20,
        status: "open",
        start_date: "",
        end_date: "",
      });
      loadQuests();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error saving quest");
    }
  };

  const handleEdit = (quest: IQuest) => {
    setForm({
      id: quest.id,
      title: quest.title,
      description: quest.description,
      entry_fee: quest.entry_fee,
      reward_1: quest.reward_1,
      reward_2: quest.reward_2,
      reward_3: quest.reward_3,
      status: quest.status,
      start_date: quest.start_date?.split("T")[0] || "",
      end_date: quest.end_date?.split("T")[0] || "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure to delete this quest?")) return;
    try {
      await api.delete(`/api/quests/${id}`);
      setMessage("Quest deleted successfully");
      loadQuests();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error deleting quest");
    }
  };

  const toggleStatus = async (quest: IQuest) => {
    const newStatus = quest.status === "open" ? "closed" : "open";
    try {
      await api.patch(`/api/quests/${quest.id}/status`, { status: newStatus });
      loadQuests();
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
        <h3 className="mb-3">Manage Quests</h3>
        {message && <div className="alert alert-info">{message}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label>Entry Fee (Coins)</label>
            <input
              type="number"
              className="form-control"
              value={form.entry_fee}
              onChange={e => setForm({ ...form, entry_fee: Number(e.target.value) })}
            />
          </div>

          <div className="mb-3 d-flex gap-2">
            <div>
              <label>Reward 1</label>
              <input
                type="number"
                className="form-control"
                value={form.reward_1}
                onChange={e => setForm({ ...form, reward_1: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Reward 2</label>
              <input
                type="number"
                className="form-control"
                value={form.reward_2}
                onChange={e => setForm({ ...form, reward_2: Number(e.target.value) })}
              />
            </div>
            <div>
              <label>Reward 3</label>
              <input
                type="number"
                className="form-control"
                value={form.reward_3}
                onChange={e => setForm({ ...form, reward_3: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="mb-3 d-flex gap-2">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                value={form.end_date}
                onChange={e => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>

          <button className="btn btn-success mb-3" type="submit">
            {form.id ? "Update" : "Create"}
          </button>
        </form>

        <hr />

        {/* Quest List */}
        <h5 className="mt-3">All Quests</h5>
        <table className="table table-striped">
          <thead>
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
            {quests.map(q => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.title}</td>
                <td>{q.entry_fee}</td>
                <td>{`${q.reward_1}/${q.reward_2}/${q.reward_3}`}</td>
                <td>{q.status}</td>
                <td>
                  {q.start_date?.split("T")[0]} - {q.end_date?.split("T")[0]}
                </td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(q)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(q.id)}>
                    Delete
                  </button>
                  <button className="btn btn-warning btn-sm" onClick={() => toggleStatus(q)}>
                    {q.status === "open" ? "Close" : "Open"}
                  </button>
                </td>
              </tr>
            ))}
            {quests.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No quests available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQuestPage;
