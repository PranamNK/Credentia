import { useState, type FC } from "react";
import type { Role } from "../types.js";
import type { InstitutionRecord } from "../types.js";

interface RoleSelectionScreenProps {
  onSelectRole: (role: Role) => void;
  institutions: InstitutionRecord[];
  onSelectInstitution: (institution: InstitutionRecord) => void;
}

export const RoleSelectionScreen: FC<RoleSelectionScreenProps> = ({
  onSelectRole,
  institutions,
  onSelectInstitution,
}) => {
  const [institutionId, setInstitutionId] = useState(institutions[0]?.id ?? "");
  const selectedInstitution =
    institutions.find((institution) => institution.id === institutionId) ??
    institutions[0];
  return (
    <div className="role-select-page">
      <div className="role-select-header">
        <span
          className="demo-pill"
          style={{ marginBottom: "16px", display: "inline-block" }}
        >
          Institutional Sandbox Environment · Instant Access Demo
        </span>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          Choose how you’re using Credentia
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#64748b",
            marginTop: "10px",
            maxWidth: "620px",
            marginInline: "auto",
          }}
        >
          Explore the credential trust network as an accreditation authority,
          educational institution, or verifier.
        </p>
      </div>

      <div className="role-select-cards">
        {/* Role 1: Accreditation Authority */}
        <div className="role-card">
          <div>
            <div className="role-card-icon">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="role-card-title">Accreditation Authority</h3>
            <p className="role-card-desc">
              Onboard institutions, manage statutory accreditations, and
              authorize institutional primary issuers.
            </p>

            <ul className="role-card-caps">
              <li>Institutional Onboarding & Verification</li>
              <li>Accreditation Lifecycle & Expiry Alerts</li>
              <li>Issuer Authorization Governance</li>
              <li>Immutable System Audit Trail</li>
            </ul>
          </div>

          <div>
            <div className="role-card-context">
              Active Board: National Higher Education Accreditation Council
              (NHEAC)
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => onSelectRole("authority")}
            >
              Continue as Authority →
            </button>
          </div>
        </div>

        {/* Role 2: Educational Institution */}
        <div className="role-card">
          <div>
            <div className="role-card-icon">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <h3 className="role-card-title">Institution / Issuer</h3>
            <p className="role-card-desc">
              Issue and manage cryptographically verifiable academic degrees,
              transcripts, and credentials.
            </p>

            <ul className="role-card-caps">
              <li>Individual & Batch Credential Issuance</li>
              <li>Credential Revocation & Suspension</li>
              <li>Version Provenance & Reissuance</li>
              <li>Institutional Cryptographic Keys</li>
            </ul>
          </div>

          <div>
            <div className="role-card-context">
              Sign in to your institution
              <select
                id="institution-context"
                value={institutionId}
                onChange={(event) => setInstitutionId(event.target.value)}
                style={{ display: "block", width: "100%", marginTop: "8px" }}
              >
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name} ({institution.id})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => {
                if (selectedInstitution)
                  onSelectInstitution(selectedInstitution);
                onSelectRole("institution");
              }}
            >
              Continue as Institution →
            </button>
          </div>
        </div>

        {/* Role 3: Credential Verifier */}
        <div className="role-card">
          <div>
            <div className="role-card-icon">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="role-card-title">Credential Verifier</h3>
            <p className="role-card-desc">
              Verify credentials and inspect comprehensive multi-point evidence
              behind academic records.
            </p>

            <ul className="role-card-caps">
              <li>Instant QR & ID Verification</li>
              <li>5-Point Evidence Trust Chain Inspection</li>
              <li>Provenance & Lifecycle Verification</li>
              <li>Downloadable Verification Dossier</li>
            </ul>
          </div>

          <div>
            <div className="role-card-context">
              Verifier Context: Global Talent Acquisition / Admissions
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => onSelectRole("verifier")}
            >
              Continue as Verifier →
            </button>
          </div>
        </div>
      </div>

      {/* Assurance banner & metrics */}
      <div
        className="card"
        style={{
          marginTop: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          padding: "20px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#e8f5e9",
              color: "#1b4332",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            🛡
          </div>
          <div>
            <div
              style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}
            >
              Evidence-Based Institutional Trust
            </div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              Zero crypto-wallet friction · 100% W3C standard cryptographic
              interoperability
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          <div>
            <strong style={{ color: "#0f172a" }}>1,248</strong> Verified Degrees
          </div>
          <div>
            <strong style={{ color: "#0f172a" }}>84</strong> Accredited
            Universities
          </div>
          <div>
            <strong style={{ color: "#1b4332" }}>99.98%</strong> Trust Score
          </div>
        </div>
      </div>
    </div>
  );
};

