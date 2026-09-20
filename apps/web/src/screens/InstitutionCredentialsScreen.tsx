import type { FC } from "react";
import { useState } from "react";
import { StatCard } from "../components/StatCard.js";
import { StatusBadge } from "../components/StatusBadge.js";
import type { RegisteredCredentialItem } from "../types.js";

interface InstitutionCredentialsScreenProps {
  credentials: RegisteredCredentialItem[];
  institutionName?: string;
  institutionCode?: string;
  onIssueCredential: (input: {
    studentName: string;
    studentId: string;
    degree: string;
    graduationDate: string;
    issuerDid: string;
    issuerName: string;
  }) => Promise<void>;
  onViewPresentation: (id: string) => void;
  onVerifyCredential: (id: string) => void;
  onManageLifecycle: (item: RegisteredCredentialItem) => void;
  initialTab?: "registry" | "issue";
}

export const InstitutionCredentialsScreen: FC<InstitutionCredentialsScreenProps> = ({
  credentials,
  institutionName = "ABC University",
  institutionCode = "INST-0001",
  onIssueCredential,
  onViewPresentation,
  onVerifyCredential,
  onManageLifecycle,
  initialTab = "registry",
}) => {
  const [activeTab, setActiveTab] = useState<"registry" | "issue">(initialTab);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [issuing, setIssuing] = useState(false);
  const [issueMethod, setIssueMethod] = useState<"manual" | "pdf">("manual");
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);
  const [uploadedCsv, setUploadedCsv] = useState<string | null>(null);

  // Issuance form
  const [issueForm, setIssueForm] = useState({
    studentName: "Rahul Kumar",
    studentId: "CSE2026-001",
    nationalId: "IN-2022-88192",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    grade: "9.42 / 10 (First Class with Distinction)",
    graduationDate: "2026-05-01",
    issuerDid: "did:web:wvit.edu.in#iss-001",
    issuerName: "Dr. Ananya Rao · Dean of Academic Affairs",
  });

  const filteredCredentials = credentials.filter((c) => {
    const matchesFilter = statusFilter === "ALL" || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.studentRollId.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.degree.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    try {
      await onIssueCredential({
        studentName: issueForm.studentName,
        studentId: issueForm.studentId,
        degree: issueForm.degree,
        graduationDate: issueForm.graduationDate,
        issuerDid: issueForm.issuerDid,
        issuerName: issueForm.issuerName,
      });
      setActiveTab("registry");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div>
      <div className="breadcrumb">
        <span>Educational Institution</span>
        <span className="breadcrumb-sep">/</span>
        <span>{institutionName} ({institutionCode})</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-active">Academic Credential Center</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{institutionName} · Academic Credential Center</h1>
          <p className="page-subtitle">Institutional credential workspace · Institution ID: {institutionCode}</p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => document.getElementById("batch-csv-input")?.click()}
          >
            {uploadedCsv ? `CSV: ${uploadedCsv}` : "Batch CSV"}
          </button>
          <input id="batch-csv-input" type="file" accept=".csv,text/csv" hidden onChange={(e) => setUploadedCsv(e.target.files?.[0]?.name ?? null)} />
          <button
            type="button"
            className={`btn ${activeTab === "issue" ? "btn-secondary" : "btn-primary"}`}
            onClick={() => setActiveTab(activeTab === "issue" ? "registry" : "issue")}
          >
            {activeTab === "issue" ? "← Back to Registry" : "+ Issue Academic Credential"}
          </button>
        </div>
      </div>

      {/* 4 Restrained KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Credentials Issued"
          value={credentials.length}
          subtext="Official degrees & transcripts"
          isFocal={true}
        />
        <StatCard
          label="Active Credentials"
          value={credentials.filter((c) => c.status === "active").length}
          subtext="Currently in good standing"
        />
        <StatCard
          label="Revoked / Suspended"
          value={credentials.filter((c) => c.status === "revoked" || c.status === "suspended").length}
          subtext="Lifecycle attention"
        />
        <StatCard
          label="Superseded / Reissued"
          value={credentials.filter((c) => c.status === "superseded").length}
          subtext="Updated version provenance linked"
        />
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          type="button"
          className={`tab-btn ${activeTab === "registry" ? "active" : ""}`}
          onClick={() => setActiveTab("registry")}
        >
          Credential Registry & History
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "issue" ? "active" : ""}`}
          onClick={() => setActiveTab("issue")}
        >
          Issue Credential (Active Form)
        </button>
      </div>

      {/* Tab 1: Credential Registry */}
      {activeTab === "registry" && (
        <div className="table-container">
          <div className="table-toolbar">
            <div className="table-filters">
              {["ALL", "ACTIVE", "SUSPENDED", "REVOKED", "SUPERSEDED"].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`filter-btn ${statusFilter === st ? "active" : ""}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st === "ALL" ? "All Statuses" : st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div style={{ width: "260px" }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: "6px 12px", fontSize: "13px" }}
                placeholder="Search student, degree, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Credential ID</th>
                <th>Student / Graduate</th>
                <th>Degree & Discipline</th>
                <th>Conferral Date</th>
                <th>Authorized Issuer</th>
                <th>Version</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCredentials.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    No credentials found.
                  </td>
                </tr>
              ) : (
                filteredCredentials.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono" style={{ fontWeight: 600 }}>{item.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.studentName}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{item.studentRollId}</div>
                    </td>
                    <td>{item.degree}</td>
                    <td>{item.issuedDate}</td>
                    <td>{item.issuerName}</td>
                    <td>
                      <span className="demo-pill">{item.version}</span>
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewPresentation(item.id)}
                          title="View human-readable certificate"
                        >
                          Certificate
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => onVerifyCredential(item.id)}
                          title="Verify cryptographic evidence"
                        >
                          Verify
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onManageLifecycle(item)}
                          title="Suspend, revoke, or supersede"
                        >
                          Lifecycle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Issue Credential Form */}
      {activeTab === "issue" && (
        <div className="card" style={{ maxWidth: "860px" }}>
          <form onSubmit={handleIssueSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <h3 className="card-title">Issue Verifiable Academic Degree</h3>
              <p className="card-subtitle">
                Create a W3C-conformant academic credential with institutional cryptographic backing.
              </p>
            </div>

            <div className="tabs-nav" style={{ marginBottom: "20px" }}>
              <button type="button" className={`tab-btn ${issueMethod === "manual" ? "active" : ""}`} onClick={() => setIssueMethod("manual")}>Enter Manually</button>
              <button type="button" className={`tab-btn ${issueMethod === "pdf" ? "active" : ""}`} onClick={() => setIssueMethod("pdf")}>Upload Academic PDF</button>
            </div>
            {issueMethod === "pdf" && <div className="banner banner-info" style={{ marginBottom: "24px" }}>
              <div style={{ width: "100%" }}><strong>Extracted details — review before issuing</strong><p style={{ margin: "6px 0 12px", fontSize: "13px" }}>Demo extraction only; no OCR or document parser is sent to the backend.</p>
              <input type="file" accept="application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; setUploadedPdf(file.name); setIssueForm({ ...issueForm, studentName: "Aarav Sharma", studentId: "STU-0001", degree: "Bachelor of Technology in Computer Science and Engineering", grade: "8.74 / 10", graduationDate: "2024-05-31" }); }} />
              {uploadedPdf && <p style={{ margin: "12px 0 0" }}>Uploaded: <strong>{uploadedPdf}</strong> · details populated for review.</p>}</div>
            </div>}

            {/* Section 1 */}
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1b4332", marginBottom: "14px" }}>
              Section 1: Student Information
            </h4>
            <div className="form-grid" style={{ marginBottom: "24px" }}>
              <div className="form-group col-span-2">
                <label className="form-label">Full Legal Name</label>
                <input
                  className="form-input"
                  value={issueForm.studentName}
                  onChange={(e) => setIssueForm({ ...issueForm, studentName: e.target.value })}
                  placeholder="e.g. Rahul Kumar"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student Roll / Enrollment ID</label>
                <input
                  className="form-input font-mono"
                  value={issueForm.studentId}
                  onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                  placeholder="e.g. CSE2026-001"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">National Student Reference (Optional)</label>
                <input
                  className="form-input font-mono"
                  value={issueForm.nationalId}
                  onChange={(e) => setIssueForm({ ...issueForm, nationalId: e.target.value })}
                  placeholder="e.g. IN-2022-88192"
                />
              </div>
            </div>

            {/* Section 2 */}
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1b4332", marginBottom: "14px", borderTop: "1px solid #edf2f7", paddingTop: "18px" }}>
              Section 2: Academic Credential Details
            </h4>
            <div className="form-grid" style={{ marginBottom: "24px" }}>
              <div className="form-group col-span-2">
                <label className="form-label">Conferred Degree & Major</label>
                <input
                  className="form-input"
                  value={issueForm.degree}
                  onChange={(e) => setIssueForm({ ...issueForm, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Technology in Computer Science and Engineering"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Distinction / Grade</label>
                <input
                  className="form-input"
                  value={issueForm.grade}
                  onChange={(e) => setIssueForm({ ...issueForm, grade: e.target.value })}
                  placeholder="e.g. 9.42 / 10 (First Class with Distinction)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Conferral / Graduation Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={issueForm.graduationDate}
                  onChange={(e) => setIssueForm({ ...issueForm, graduationDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Section 3 */}
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1b4332", marginBottom: "14px", borderTop: "1px solid #edf2f7", paddingTop: "18px" }}>
              Section 3: Authorized Signer Delegation
            </h4>
            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label className="form-label">Designated Institutional Signing Authority</label>
              <select
                className="form-select"
                value={issueForm.issuerDid}
                onChange={(e) => setIssueForm({ ...issueForm, issuerDid: e.target.value })}
              >
                <option value="did:web:wvit.edu.in#iss-001">
                  Dr. Ananya Rao · Dean of Academic Affairs (Key #dean-ed25519-01)
                </option>
                <option value="did:web:wvit.edu.in#iss-001">
                  Prof. Rajesh Verma · University Registrar (Key #reg-ed25519-02)
                </option>
              </select>
            </div>

            {/* Reassurance note */}
            <div className="banner banner-info" style={{ marginBottom: "24px" }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span style={{ fontSize: "13px" }}>
                Credential will be cryptographically signed with the selected WVIT issuer key after you review the details.</span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTab("registry")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={issuing}>
                {issuing ? "Signing & Anchoring..." : "Generate & Sign Credential →"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};




