import type { FC } from "react";
import { useState } from "react";
import type { InstitutionRecord } from "../types.js";

interface OnboardInstitutionScreenProps {
  onSuccess: (newInst: InstitutionRecord) => void;
  onNavigateToAuthorize: (instId: string) => void;
  onCancel: () => void;
}

export const OnboardInstitutionScreen: FC<OnboardInstitutionScreenProps> = ({
  onSuccess,
  onNavigateToAuthorize,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [completed, setCompleted] = useState(false);
  const [busy, setBusy] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "Coastal Institute of Advanced Studies",
    code: "CIAS",
    type: "Autonomous Research University",
    domain: "https://cias.edu.in",
    adminName: "Dr. Vikram Seth",
    adminEmail: "registrar@cias.edu.in",
    country: "IN",
    state: "Karnataka",
    address: "Mangalore, Karnataka, India",
    // Accreditation
    authority: "National Higher Education Accreditation Council (NHEAC)",
    grade: "Institutional Tier-1 (NAAC A++ Equivalent)",
    referenceId: "NHEAC-ACC-2026-9912",
    validFrom: "2026-07-01",
    validUntil: "2031-06-30",
    certified: false,
  });

  const [registeredRecord, setRegisteredRecord] = useState<InstitutionRecord | null>(null);

  const handleRegister = async () => {
    if (!form.certified) {
      alert("Please certify statutory accreditation compliance.");
      return;
    }

    setBusy(true);
    try {
      const generatedDid = `did:web:${form.domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}`;
      const newInst: InstitutionRecord = {
        id: `inst-${Date.now().toString(36)}`,
        name: form.name,
        code: form.code,
        type: form.type,
        country: form.country,
        state: form.state,
        accreditationStatus: "ACCREDITED",
        accreditationValidUntil: form.validUntil,
        authorizedIssuersCount: 0,
        credentialsIssuedCount: 0,
        did: generatedDid,
      };

      setRegisteredRecord(newInst);
      setCompleted(true);
      onSuccess(newInst);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  if (completed && registeredRecord) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card banner-success" style={{ padding: "28px", textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#d1fae5",
              color: "#065f46",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              margin: "0 auto 16px",
            }}
          >
            ✓
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#065f46" }}>
            {registeredRecord.name} Registered Successfully
          </h2>
          <p style={{ fontSize: "14px", color: "#047857", marginTop: "6px" }}>
            Institutional trust established on Credentia. The university accreditation is active and verified.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid #a7f3d0",
              fontSize: "13px",
            }}
          >
            <div>
              <strong>Status:</strong> Accredited Tier-1
            </div>
            <div>
              <strong>Institution Code:</strong> {registeredRecord.code}
            </div>
            <div>
              <strong>Valid Through:</strong> {registeredRecord.accreditationValidUntil}
            </div>
          </div>
        </div>

        {/* Next Step Card */}
        <div className="card" style={{ padding: "28px" }}>
          <span className="demo-pill" style={{ marginBottom: "12px", display: "inline-block" }}>
            Recommended Next Step
          </span>
          <h3 className="card-title" style={{ fontSize: "18px" }}>
            Authorize Institutional Issuers
          </h3>
          <p className="card-subtitle" style={{ fontSize: "14px", marginTop: "6px", lineHeight: "1.6" }}>
            Authorizing a university registrar or dean enables {registeredRecord.name} to designate cryptographic signing keys and begin issuing verified diplomas and transcripts.
          </p>

          <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigateToAuthorize(registeredRecord.id)}
            >
              Authorize First Issuer →
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div className="breadcrumb">
        <span>Accreditation Authority</span>
        <span className="breadcrumb-sep">/</span>
        <span>Institutions</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-active">Onboard New Institution</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Onboard Educational Institution</h1>
          <p className="page-subtitle">
            Establish institutional trust and register an accredited university or higher education provider onto the Credentia Trust Network.
          </p>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <div className="stepper">
        <div className={`step-item ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}>
          <div className="step-circle">{step > 1 ? "✓" : "1"}</div>
          <span className="step-title">01 Institution Profile</span>
        </div>
        <div className="step-line" />
        <div className={`step-item ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
          <div className="step-circle">{step > 2 ? "✓" : "2"}</div>
          <span className="step-title">02 Accreditation & Charter</span>
        </div>
        <div className="step-line" />
        <div className={`step-item ${step === 3 ? "active" : ""}`}>
          <div className="step-circle">3</div>
          <span className="step-title">03 Review & Authorize</span>
        </div>
      </div>

      {/* Step 1: Institution Details */}
      {step === 1 && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "20px" }}>
            Step 1: Institutional Identity & Governance
          </h3>

          <div className="form-grid">
            <div className="form-group col-span-2">
              <label className="form-label">Full Legal Institution Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Western Valley Institute of Technology"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institution Code / Acronym</label>
              <input
                className="form-input"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. WVIT"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Institution Classification</label>
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Autonomous Research University</option>
                <option>Institute of Technology</option>
                <option>Institute of Engineering</option>
                <option>State University</option>
                <option>Vocational College</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Official Domain / Website</label>
              <input
                className="form-input"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="https://university.edu"
              />
              <span className="form-help">Used to bind DID identifier (did:web:domain)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Jurisdiction / Country</label>
              <input
                className="form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="City, State, Country"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Administrator / Registrar Name</label>
              <input
                className="form-input"
                value={form.adminName}
                onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                placeholder="Dr. Full Name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Admin Email</label>
              <input
                className="form-input"
                type="email"
                value={form.adminEmail}
                onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                placeholder="admin.registrar@university.edu"
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
              Next: Accreditation Details →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Accreditation & Charter */}
      {step === 2 && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "20px" }}>
            Step 2: Statutory Accreditation & Charter
          </h3>

          <div className="form-grid">
            <div className="form-group col-span-2">
              <label className="form-label">Accreditation Authority</label>
              <input
                className="form-input"
                value={form.authority}
                onChange={(e) => setForm({ ...form, authority: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accreditation Type / Grade</label>
              <input
                className="form-input"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder="e.g. NAAC A++ / NBA Tier-1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Charter / Reference ID</label>
              <input
                className="form-input"
                value={form.referenceId}
                onChange={(e) => setForm({ ...form, referenceId: e.target.value })}
                placeholder="e.g. NHEAC-ACC-2026-001"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accreditation Valid From</label>
              <input
                className="form-input"
                type="date"
                value={form.validFrom}
                onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accreditation Valid Until</label>
              <input
                className="form-input"
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              />
            </div>
          </div>

          <div className="banner banner-info" style={{ marginTop: "24px" }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontSize: "13px" }}>
              Accreditation will be recorded in the Credentia institutional registry. Once registered, authorized signing officers designated by this institution can issue tamper-proof academic credentials.
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
              Next: Review & Authorize →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Authorize */}
      {step === 3 && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: "20px" }}>
            Step 3: Review & Confirm Registration
          </h3>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "10px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              fontSize: "13px",
            }}
          >
            <div>
              <div style={{ color: "#64748b", marginBottom: "2px" }}>Institution:</div>
              <strong style={{ fontSize: "15px", color: "#0f172a" }}>{form.name}</strong>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: "2px" }}>Classification:</div>
              <strong>{form.type} ({form.code})</strong>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: "2px" }}>Official Website:</div>
              <span className="font-mono">{form.domain}</span>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: "2px" }}>Registrar Contact:</div>
              <span>{form.adminName} ({form.adminEmail})</span>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: "2px" }}>Accreditation Grade:</div>
              <span className="badge badge-active">{form.grade}</span>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: "2px" }}>Validity Period:</div>
              <span>{form.validFrom} through {form.validUntil} (5 years)</span>
            </div>
          </div>

          <div style={{ margin: "24px 0" }}>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={form.certified}
                onChange={(e) => setForm({ ...form, certified: e.target.checked })}
              />
              <span>
                <strong>Statutory Certification:</strong> I certify that {form.name} has satisfied all statutory accreditation standards under National Higher Education regulations and is empowered to issue cryptographically verifiable credentials.
              </span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
              ← Back
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!form.certified || busy}
              onClick={handleRegister}
            >
              {busy ? "Registering on Network..." : "Register Institution"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
