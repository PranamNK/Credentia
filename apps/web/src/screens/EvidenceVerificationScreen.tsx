import type { FC } from "react";
import type { VerificationResult } from "@credentia/domain";
import { EvidenceCard } from "../components/EvidenceCard.js";
import { StatCard } from "../components/StatCard.js";

interface EvidenceVerificationScreenProps {
  reference: string;
  onReferenceChange: (ref: string) => void;
  onVerify: () => Promise<void>;
  onRunScenario: (scenario: any) => Promise<void>;
  result: VerificationResult | null;
  busy: boolean;
}

export const EvidenceVerificationScreen: FC<EvidenceVerificationScreenProps> = ({
  reference,
  onReferenceChange,
  onVerify,
  onRunScenario,
  result,
  busy,
}) => {

  const passedCount = result?.evidence.filter((e) => e.valid).length ?? 0;
  const totalCount = result?.evidence.length ?? 5;

  return (
    <div className="dashboard-content-layout">
      {/* 1. Page Heading + Actions */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Evidence Verification</h1>
          <p className="page-subtitle">
            Cryptographic trust evaluation across Credentia’s 5-Point Evidence Trust Chain
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onReferenceChange("CRD-00001");
              void onVerify();
            }}
          >
            Reset Verification
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void onVerify()}
            disabled={busy || !reference}
          >
            {busy ? "Evaluating Proofs..." : "Verify Reference"}
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Cards (Rhythm benchmark: 1st green focal anchor) */}
      <div className="stat-grid">
        <StatCard
          label="Overall Trust Chain"
          value={result ? (result.trusted ? "TRUSTED" : "FLAGGED") : "READY"}
          subtext={
            result
              ? `${passedCount} of ${totalCount} Evidence Checks Passed`
              : "Awaiting reference evaluation"
          }
          trend={result?.trusted ? "100% Chain Valid" : result ? "Integrity Warning" : "Ready"}
          isFocal={result ? result.trusted : true}
        />
        <StatCard
          label="1. Integrity & Digest"
          value={
            result?.evidence.find((e) => e.check === "integrity")?.valid
              ? "Verified"
              : result
              ? "Failed"
              : "Pending"
          }
          subtext="Ed25519Signature2020 proof"
        />
        <StatCard
          label="2. Institutional Issuer"
          value={
            result?.evidence.find((e) => e.check === "issuer")?.valid
              ? "Authorized"
              : result
              ? "Unrecognized"
              : "Pending"
          }
          subtext="Faculty signing authority"
        />
        <StatCard
          label="3. Accreditation & Status"
          value={
            result?.evidence.find((e) => e.check === "accreditation")?.valid &&
            result?.evidence.find((e) => e.check === "status")?.valid
              ? "In Standing"
              : result
              ? "Review Flag"
              : "Pending"
          }
          subtext="Tier-1 statutory status"
          trend={result && !result.trusted ? "Audit Alert" : undefined}
        />
      </div>

      {/* 3. Reference Input Bar & Canonical Scenarios */}
      <div className="card" style={{ marginBottom: "24px", padding: "20px 24px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className="form-input"
              style={{
                borderRadius: "9999px",
                padding: "10px 18px",
                fontSize: "14px",
                background: "#f8faf9",
                border: "1px solid #e2e8f0",
              }}
              placeholder="Enter Credential ID, URN, or DID reference (e.g. CRD-00001)..."
              value={reference}
              onChange={(e) => onReferenceChange(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || !reference}
            onClick={() => void onVerify()}
          >
            {busy ? "Evaluating..." : "Run Trust Check"}
          </button>
        </div>

      </div>

      {/* 4. 5-Point Evidence Trust Chain Cards */}
      <div className="card" style={{ padding: "28px" }}>
        <div className="card-header" style={{ marginBottom: "20px" }}>
          <div>
            <h3 className="card-title" style={{ fontSize: "18px" }}>5-Point Evidence Trust Chain</h3>
            <p className="card-subtitle">
              Every academic claim requires comprehensive proof across all five independent trust layers
            </p>
          </div>
          {result && (
            <span
              className={`badge ${result.trusted ? "badge-active" : "badge-revoked"}`}
              style={{ fontSize: "13px", padding: "6px 14px" }}
            >
              <span className="badge-dot" />
              {result.trusted ? "All Trust Layers Passed" : "Trust Chain Incomplete / Revoked"}
            </span>
          )}
        </div>

        {result ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {result.evidence.map((item) => (
              <EvidenceCard key={item.check} evidence={item} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            <p style={{ fontSize: "15px", marginBottom: "8px" }}>
              No active evaluation loaded.
            </p>
            <p style={{ fontSize: "13px", color: "#94a3b8" }}>
              Select a canonical test scenario above or enter a credential reference to inspect the 5-point evidence trust chain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
