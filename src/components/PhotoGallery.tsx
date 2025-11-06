// frontend/src/components/PhotoGallery.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

interface Quest {
  id: number;
  title: string;
  // description: string;
  start_date: string;
  end_date: string;
}

interface Photo {
  id: number;
  title: string;
  // description: string;
  file_url: string;
  user_id: number;
  quest_id?: number | null;
  likes?: number;
}

interface Comment {
  id: number;
  comment: string;
  user_name: string;
  created_at: string;
}

const PhotoGallery: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [photosByQuest, setPhotosByQuest] = useState<Record<number, Photo[]>>({});
  const [generalPhotos, setGeneralPhotos] = useState<Photo[]>([]);
  const [likesMap, setLikesMap] = useState<Record<number, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({});
  const [showCommentsMap, setShowCommentsMap] = useState<Record<number, boolean>>({});
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const [selectedQuestId, setSelectedQuestId] = useState<number | "general">(0);
  const [modalPhoto, setModalPhoto] = useState<Photo | null>(null);

  // แค่เอาวันที่ตรงจากฐานข้อมูล
  const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  return dateStr.split("T")[0]; // YYYY-MM-DD
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // โหลด Quest ที่ผู้ใช้เข้าร่วม
        const questRes = await api.get("/api/quests/joined");
        const questsSorted = questRes.data.sort(
          (a: Quest, b: Quest) =>
            new Date(a.start_date.replace(" ", "T")).getTime() -
            new Date(b.start_date.replace(" ", "T")).getTime()
        );
        setQuests(questsSorted);

        // โหลดรูปทั่วไป
        const generalRes = await api.get("/api/photos");
        const generalFiltered = generalRes.data.filter((p: Photo) => !p.quest_id);
        setGeneralPhotos(generalFiltered);

        // โหลดรูปของแต่ละ Quest
        const photosMap: Record<number, Photo[]> = {};
        for (const q of questsSorted) {
          const res = await api.get(`/api/photos?quest_id=${q.id}`);
          const photosWithLikes = await Promise.all(
            res.data.map(async (p: Photo) => {
              const likesRes = await api.get(`/api/photos/${p.id}/likes`);
              const commentsRes = await api.get(`/api/photos/${p.id}/comments`);
              setLikesMap(prev => ({ ...prev, [p.id]: likesRes.data.count }));
              setCommentsMap(prev => ({ ...prev, [p.id]: commentsRes.data }));
              return { ...p, likes: likesRes.data.count };
            })
          );
          photosWithLikes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          photosMap[q.id] = photosWithLikes;
        }
        setPhotosByQuest(photosMap);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const selectedQuestObj = selectedQuestId === "general" ? null : quests.find(q => q.id === selectedQuestId);

  const toggleLike = async (photoId: number) => {
    try {
      const res = await api.post(`/api/photos/${photoId}/like`);
      setLikesMap(prev => ({ ...prev, [photoId]: res.data.count }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = (photoId: number) => {
    setShowCommentsMap(prev => ({ ...prev, [photoId]: !prev[photoId] }));
  };

  const addComment = async (photoId: number) => {
    const text = newComments[photoId]?.trim();
    if (!text) return;

    try {
      await api.post(`/api/photos/${photoId}/comment`, { comment: text });
      const commentsRes = await api.get(`/api/photos/${photoId}/comments`);
      setCommentsMap(prev => ({ ...prev, [photoId]: commentsRes.data }));
      setNewComments(prev => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const renderPhotoCard = (photo: Photo) => (
    <div
      key={photo.id}
      className="card mb-3 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => setModalPhoto(photo)}
    >
      <img
        src={`http://localhost:5000/uploads/photos/${photo.file_url}`}
        alt={photo.title}
        className="card-img-top"
        style={{ maxHeight: 200, objectFit: "cover" }}
      />
      <div className="card-body p-2">
        <h6 className="card-title mb-1">{photo.title}</h6>
        {/* <p className="card-text mb-1" style={{ fontSize: "0.85rem" }}>
          {photo.description}
        </p> */}
        <div>
          <button
            className="btn btn-sm btn-outline-danger me-1"
            onClick={e => {
              e.stopPropagation();
              toggleLike(photo.id);
            }}
          >
            ❤️ {likesMap[photo.id] || 0}
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={e => {
              e.stopPropagation();
              toggleComments(photo.id);
            }}
          >
            💬 {commentsMap[photo.id]?.length || 0}
          </button>
        </div>
        {showCommentsMap[photo.id] && (
          <div className="mt-2">
            {(commentsMap[photo.id] || []).map(c => (
              <p key={c.id} style={{ fontSize: "0.85rem" }}>
                <strong>{c.user_name}:</strong> {c.comment}
              </p>
            ))}
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="พิมพ์คอมเมนต์..."
                value={newComments[photo.id] || ""}
                onChange={e => setNewComments(prev => ({ ...prev, [photo.id]: e.target.value }))}
              />
              <button className="btn btn-primary" onClick={() => addComment(photo.id)}>
                ส่ง
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      {/* <h2 className="text-primary fw-bold mb-4">🎉 ประกวดภาพ</h2> */}
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="list-group">
            {quests.map(q => (
              <button
                key={q.id}
                className={`list-group-item list-group-item-action ${selectedQuestId === q.id ? "active" : ""}`}
                onClick={() => setSelectedQuestId(q.id)}
              >
                {q.title}
              </button>
            ))}
            <button
              className={`list-group-item list-group-item-action ${selectedQuestId === "general" ? "active" : ""}`}
              onClick={() => setSelectedQuestId("general")}
            >
              รูปทั่วไป
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          {selectedQuestId === "general" && (
            <div className="row g-3">
              {generalPhotos.length > 0
                ? generalPhotos.map(p => <div key={p.id} className="col-md-4">{renderPhotoCard(p)}</div>)
                : <p>ยังไม่มีรูปทั่วไป</p>}
            </div>
          )}

          {selectedQuestObj && (
            <>
              <div className="mb-3">
                <h4>{selectedQuestObj.title}</h4>
                {/* <p>{selectedQuestObj.description}</p> */}
                <small className="text-muted">
                  เริ่ม: {formatDate(selectedQuestObj.start_date)} | 
                  สิ้นสุด: {formatDate(selectedQuestObj.end_date)}
                </small>
              </div>
              <div className="row g-3">
                {(photosByQuest[selectedQuestObj.id] || []).length > 0
                  ? photosByQuest[selectedQuestObj.id].map(p => <div key={p.id} className="col-md-4">{renderPhotoCard(p)}</div>)
                  : <p>ยังไม่มีรูปภาพใน Quest นี้</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalPhoto && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setModalPhoto(null)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalPhoto.title}</h5>
                <button type="button" className="btn-close" onClick={() => setModalPhoto(null)}></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={`http://localhost:5000/uploads/photos/${modalPhoto.file_url}`}
                  alt={modalPhoto.title}
                  className="img-fluid"
                  style={{ maxHeight: "60vh", objectFit: "contain" }}
                />
                {/* <p className="mt-2">{modalPhoto.description}</p> */}
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => toggleLike(modalPhoto.id)}>❤️ {likesMap[modalPhoto.id] || 0}</button>
                <button className="btn btn-primary" onClick={() => toggleComments(modalPhoto.id)}>💬 {commentsMap[modalPhoto.id]?.length || 0}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
