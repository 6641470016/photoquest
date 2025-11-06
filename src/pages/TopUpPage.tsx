// frontend/src/pages/user/TopUpPage.tsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

interface TopupPackage {
  id: number;
  name: string;
  coins: number;
  price: number;
  qr_url: string;
}

const TopUpPage: React.FC = () => {
  const [packages, setPackages] = useState<TopupPackage[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/packages").then(res => setPackages(res.data)).catch(() => {});
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !file) { setMessage("เลือกแพ็กเกจและอัปโหลดสลิป"); return; }

    const form = new FormData();
    form.append("slip", file);
    form.append("package_id", String(selectedId));

    try {
      const res = await api.post("/api/transactions/topup", form, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage(res.data.message || "Uploaded");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Top-Up</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row">
        <div className="col-md-6">
          <h5>Packages</h5>
          <ul className="list-group">
            {packages.map(p => (
              <li key={p.id} className={`list-group-item ${selectedId===p.id ? "active":""}`} onClick={()=>setSelectedId(p.id)}>
                {p.name} — {p.coins} coins — {p.price} ฿
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>Selected</h5>
          {selectedId ? (
            <>
              { (() => {
                const pkg = packages.find(p=>p.id===selectedId)!;
                return (
                  <>
                    <p><strong>{pkg.name}</strong></p>
                    <p>Price: {pkg.price} ฿</p>
                    <img src={pkg.qr_url} alt="QR" style={{maxWidth:"250px"}}/>
                    <form onSubmit={handleUpload} className="mt-3">
                      <div className="mb-3">
                        <label className="form-label">Upload slip</label>
                        <input type="file" className="form-control" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                      </div>
                      <button className="btn btn-primary" type="submit">Upload Slip</button>
                    </form>
                  </>
                );
              })()}
            </>
          ): <p>กรุณาเลือกแพ็กเกจ</p>}
        </div>
      </div>
    </div>
  );
};

export default TopUpPage;
