// frontend/src/components/UploadPhoto.tsx
import React, { useState, useEffect } from "react";
import api from "../services/api";

interface Quest {
  id: number;
  title: string;
}

const UploadPhoto: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questId, setQuestId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // โหลด Quest ที่ผู้ใช้เข้าร่วมแล้ว
  useEffect(() => {
    const fetchUserQuests = async () => {
      try {
        const res = await api.get("/api/quests/joined");
        setQuests(res.data || []);
      } catch (err: any) {
        console.error("Failed to load joined quests", err);
        setMessage("❌ ไม่สามารถโหลดรายการ Quest ที่เข้าร่วมได้");
      }
    };
    fetchUserQuests();
  }, []);

  // ส่งรูปภาพขึ้น server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("❌ กรุณาเลือกรูปภาพก่อนอัปโหลด");
      return;
    }
    if (!title.trim()) {
      setMessage("❌ กรุณากรอกชื่อรูปภาพ");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (questId) formData.append("quest_id", questId.toString());
      formData.append("photo", file);

      const res = await api.post("/api/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "✅ อัปโหลดรูปภาพสำเร็จ!");

      // รีเซ็ตฟอร์ม
      setTitle("");
      setDescription("");
      setFile(null);
      setQuestId(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      const msg = err.response?.data?.message || "เกิดข้อผิดพลาดระหว่างอัปโหลด";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h3 className="mb-4 text-primary fw-bold">📤 อัปโหลดรูปภาพเข้าประกวด</h3>

      {/* ข้อความแจ้งเตือน */}
      {message && (
        <div className={`alert ${message.includes("✅") ? "alert-success" : "alert-warning"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label fw-semibold">ชื่อรูปภาพ</label>
          <input
            type="text"
            className="form-control"
            placeholder="เช่น วิวภูเขา"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label fw-semibold">คำอธิบาย</label>
          <textarea
            className="form-control"
            placeholder="อธิบายเกี่ยวกับรูปภาพของคุณ"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Quest Selection */}
        <div className="mb-3">
          <label className="form-label fw-semibold">เลือก Quest (ถ้ามี)</label>
          <select
            className="form-select"
            value={questId || ""}
            onChange={(e) => setQuestId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">-- ไม่เลือก Quest --</option>
            {quests.length > 0 ? (
              quests.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))
            ) : (
              <option disabled>ไม่มี Quest ที่เข้าร่วม</option>
            )}
          </select>
        </div>

        {/* File Upload */}
        <div className="mb-3">
          <label className="form-label fw-semibold">เลือกรูปภาพ</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* Preview */}
        {file && (
          <div className="mb-3 text-center">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: 250,
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
          {loading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
        </button>
      </form>
    </div>
  );
};

export default UploadPhoto;
