import { useState } from "react";
import type { InstitutionRecord, IssuerRecord } from "../types.js";

export function InstitutionAdminScreen({ institution, issuers, onBack }: { institution: InstitutionRecord; issuers: IssuerRecord[]; onBack: () => void }) {
  const [editing, setEditing] = useState(false);
  const [admin, setAdmin] = useState({ name: "Dr. Ananya Rao", email: "ananya.rao@wvit.edu.in" });
  return <div className="dashboard-content-layout">
    <div className="page-header"><div><h1 className="page-title">Institution Administration</h1><p className="page-subtitle">Authority governance view · frontend demo changes are not on-chain.</p></div><button className="btn btn-secondary" onClick={onBack}>← Institutions</button></div>
    <div className="card" style={{ maxWidth: "850px", padding: "28px" }}>
      <h2 className="card-title">{institution.name}</h2><p className="card-subtitle">{institution.id} · {institution.did}</p>
      <div className="form-grid" style={{ marginTop: "24px" }}>
        <div><div className="form-label">Accreditation</div><strong>{institution.accreditationStatus}</strong></div>
        <div><div className="form-label">Valid until</div><strong>{institution.accreditationValidUntil ?? "Not recorded"}</strong></div>
        <div className="col-span-2"><div className="form-label">Institution Administrator</div>{editing ? <div style={{ display: "grid", gap: "10px" }}><input className="form-input" value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })}/><input className="form-input" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })}/></div> : <><strong>{admin.name}</strong><div>{admin.email}</div></>}</div>
      </div>
      <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}><button className="btn btn-primary" onClick={() => setEditing(!editing)}>{editing ? "Save demo administrator" : "Change Administrator"}</button><button className="btn btn-secondary" onClick={() => alert("Accreditation details are shown above.")}>View Accreditation</button></div>
      <hr style={{ margin: "28px 0", border: 0, borderTop: "1px solid #e5e7eb" }}/><h3 className="card-title">Authorized Issuers</h3>
      {issuers.filter((issuer) => issuer.institutionId === institution.id).map((issuer) => <div key={issuer.id} style={{ padding: "12px 0", borderBottom: "1px solid #eef2ef" }}><strong>{issuer.name}</strong><div className="font-mono-subtle">{issuer.did}</div></div>)}
    </div>
  </div>;
}
