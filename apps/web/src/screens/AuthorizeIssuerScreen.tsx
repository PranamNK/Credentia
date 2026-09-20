import type { FC } from "react";
import { useState } from "react";
import type { IssuerRecord } from "../types.js";

interface AuthorizeIssuerScreenProps {
  institutionName?: string;
  institutionCode?: string;
  onSuccess: (issuer: IssuerRecord) => void;
  onNavigateToIssue: () => void;
  onCancel: () => void;
}

export const AuthorizeIssuerScreen: FC<AuthorizeIssuerScreenProps> = ({
  institutionName = "ABC University",
  institutionCode = "INST-0001",
  onSuccess,
  onNavigateToIssue,
  onCancel,
}) => {
  const [form, setForm] = useState({
    name: "Dr. Ananya Rao",
    role: "Dean of Academic Affairs",
    department: "Faculty of Engineering & Technology",
    email: "ananya.rao@wvit.edu.in",
    facultyId: "FAC-08421",
    types: ["Bachelor of Technology", "Master of Science", "Academic Transcripts"],
    keyMethod: "did:web:wvit.edu.in#iss-001",
    validUntil: "2029-12-31",
    certified: false,
  });

  const [authorized, setAuthorized] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleType = (t: string) => {
    if (form.types.includes(t)) {
      setForm({ ...form, types: form.types.filter((item) => item !== t) });
    } else {
      setForm({ ...form, types: [...form.types, t] });
    }
  };

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.certified) {
      alert("Please confirm statutory signing authorization.");
      return;
    }

    setBusy(true);
    try {
      const newIssuer: IssuerRecord = {
        id: `iss-${Date.now().toString(36)}`,
        institutionId: institutionCode,
        name: form.name,
        role: form.role,
        department: form.department,
        email: form.email,
        facultyId: form.facultyId,
        did: form.keyMethod,
        keyStatus: "ACTIVE",
        permittedCredentialTypes: form.types,
        validUntil: form.validUntil,
      };

      setAuthorized(true);
      onSuccess(newIssuer);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="breadcrumb">
        <span>Institutions</span>
        <span className="breadcrumb-sep">/</span>
        <span>{institutionName} ({institutionCode})</span>
        <span className="breadcrumb-sep">/</span>
        <span>Issuers</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-active">Authorize New Issuer</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Authorize Institutional Issuer</h1>
          <p className="page-subtitle">
            Grant cryptographic credential signing authority to an authorized university officer or academic department.
          </p>
        </div>

        <div className="header-actions">
          <span className="badge badge-active" style={{ fontSize: "13px", padding: "6px 12px" }}>
            <span className="badge-dot" />
            <span>{institutionName} · Accredited</span>
          </span>
        </div>
      </div>

      {authorized && (
        <div className="banner banner-success" style={{ marginBottom: "28px", padding: "20px" }}>
          <div>
            <strong style={{ fontSize: "16px", display: "block" }}>
              {form.name} authorized successfully as signing officer
            </strong>
            <p style={{ marginTop: "4px", fontSize: "13px" }}>
              Institutional key `{form.keyMethod}` is now bound to {form.role}. Credentials signed with this key will automatically verify across the network.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={onNavigateToIssue}>
            Go to Issue Credential →
          </button>
        </div>
      )}

      {/* 2-Column Layout (Left 65%, Right 35%) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "28px", alignItems: "start" }}>
        {/* Left Form Column */}
        <div className="card">
          <form onSubmit={handleAuthorize}>
            {/* Section 1 */}
            <h3 className="card-title" style={{ marginBottom: "16px" }}>
              1. Issuer Identity & Academic Role
            </h3>

            <div className="form-grid" style={{ marginBottom: "24px" }}>
              <div className="form-group col-span-2">
                <label className="form-label">Full Legal Name & Academic Title</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dr. Ananya Rao"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Title / Statutory Role</label>
                <input
                  className="form-input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Dean of Academic Affairs"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Faculty</label>
                <input
                  className="form-input"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Faculty of Engineering"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Institutional Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ananya.rao@university.edu"
                  required
                />
                <span className="form-help">Must match verified institutional domain</span>
              </div>

              <div className="form-group">
                <label className="form-label">Employee / Faculty ID</label>
                <input
                  className="form-input"
                  value={form.facultyId}
                  onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
                  placeholder="e.g. FAC-08421"
                  required
                />
              </div>
            </div>

            {/* Section 2 */}
            <h3 className="card-title" style={{ marginBottom: "16px", borderTop: "1px solid #edf2f7", paddingTop: "20px" }}>
              2. Signing Authority & Scope
            </h3>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label className="form-label">Permitted Credential Types</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
                {[
                  "Bachelor of Technology",
                  "Master of Science",
                  "Ph.D. Licensure",
                  "Academic Transcripts",
                  "Postgraduate Diploma",
                ].map((type) => {
                  const selected = form.types.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      className={`btn btn-sm ${selected ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => toggleType(type)}
                    >
                      {selected ? "✓ " : "+ "} {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: "24px" }}>
              <div className="form-group">
                <label className="form-label">Institutional Key / Signing DID</label>
                <input
                  className="form-input font-mono"
                  value={form.keyMethod}
                  onChange={(e) => setForm({ ...form, keyMethod: e.target.value })}
                />
                <span className="form-help">Status: Hardware-backed Ed25519 key</span>
              </div>

              <div className="form-group">
                <label className="form-label">Authorization Valid Until</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                />
                <span className="form-help">Aligned with institutional accreditation</span>
              </div>
            </div>

            {/* Section 3 */}
            <div style={{ borderTop: "1px solid #edf2f7", paddingTop: "20px", marginBottom: "24px" }}>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={form.certified}
                  onChange={(e) => setForm({ ...form, certified: e.target.checked })}
                />
                <span>
                  <strong>Statutory Designation:</strong> I confirm that {form.name} is an authorized statutory officer of {institutionName} empowered to cryptographically sign degree certificates and academic records.
                </span>
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!form.certified || busy}
              >
                {busy ? "Authorizing..." : "Grant Signing Authority"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Preview Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card">
            <h3 className="card-title" style={{ fontSize: "15px", marginBottom: "16px" }}>
              Issuer Authority Dossier
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#e8f5e9",
                  color: "#1b4332",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                {form.name
                  .split(" ")
                  .map((n) => n[0])
                  .filter((_, idx, arr) => idx === 0 || idx === arr.length - 1)
                  .join("")}
              </div>

              <div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{form.name}</div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>{form.role}</div>
              </div>
            </div>

            <dl style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "8px 12px", fontSize: "12px" }}>
              <dt style={{ color: "#64748b" }}>Organization:</dt>
              <dd style={{ fontWeight: 600 }}>{institutionName}</dd>

              <dt style={{ color: "#64748b" }}>Department:</dt>
              <dd>{form.department}</dd>

              <dt style={{ color: "#64748b" }}>Status:</dt>
              <dd>
                <span className="badge badge-active">Ready to Bind</span>
              </dd>

              <dt style={{ color: "#64748b" }}>Key Type:</dt>
              <dd>Ed25519 Institutional Key</dd>
            </dl>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ fontSize: "14px", marginBottom: "12px" }}>
              Compliance & Governance Checklist
            </h3>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#065f46" }}>
                <span>✓</span> Domain validation passed (@wvit.edu.in)
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#065f46" }}>
                <span>✓</span> Institution in active accreditation standing
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#065f46" }}>
                <span>✓</span> Signing rights scoped to academic credentials
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#065f46" }}>
                <span>✓</span> Immutable audit event logged upon authorization
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
