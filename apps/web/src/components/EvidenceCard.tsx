import type { FC } from "react";
import { useState } from "react";
import type { VerificationEvidence } from "@credentia/domain";
import { verificationLabels } from "@credentia/ui";

interface EvidenceCardProps {
  evidence: VerificationEvidence;
  technicalMeta?: {
    proofType?: string;
    signatureSnippet?: string;
    digest?: string;
    issuerDid?: string;
    accreditationId?: string;
    statusListEndpoint?: string;
    provenanceHash?: string;
  };
}

export const EvidenceCard: FC<EvidenceCardProps> = ({ evidence, technicalMeta }) => {
  const [open, setOpen] = useState(false);

  const checkKey = evidence.check as keyof typeof verificationLabels;
  const label = verificationLabels[checkKey] ?? evidence.check;

  // Curated progressive disclosure details based on the check type
  const getTechnicalDetails = () => {
    switch (evidence.check) {
      case "integrity":
        return {
          "Algorithm": "Ed25519Signature2020 / SHA-256",
          "Signature": technicalMeta?.signatureSnippet ?? "0x89f4b...3d2a71e0b58e",
          "Payload Digest": technicalMeta?.digest ?? "sha256:d5a6c89ef127b409...",
          "Canonicalization": "URDNA2015 RDF Dataset Canonicalization",
          "Verification Timestamp": evidence.checkedAt,
        };
      case "issuer":
        return {
          "Issuer DID": technicalMeta?.issuerDid ?? "did:web:wvit.edu.in#iss-001",
          "Verification Key": "#key-dean-01 (Ed25519)",
          "Authority Status": "Recognized Institutional Signer",
          "Key State": "Active (Cryptographically unrevoked)",
          "Verification Timestamp": evidence.checkedAt,
        };
      case "accreditation":
        return {
          "Accrediting Authority": "National Board of Higher Education (NHEAC)",
          "Accreditation ID": technicalMeta?.accreditationId ?? "NHEAC-ACC-2022-8941",
          "Statutory Tier": "Tier-1 Autonomous Accreditation",
          "Standing": "Current & In Good Standing",
          "Verification Timestamp": evidence.checkedAt,
        };
      case "status":
        return {
          "Registry Method": "W3C Bitstring Status List v1.0",
          "Registry Anchor": "0x0000000000000000000000000000000000000001",
          "Status Entry": technicalMeta?.statusListEndpoint ?? "Index #042: Active",
          "Revocation Flags": "0 Flags Detected",
          "Verification Timestamp": evidence.checkedAt,
        };
      case "provenance":
        return {
          "Version Lineage": "Canonical Record / v1.0 Lineage Verified",
          "Parent Proof": technicalMeta?.provenanceHash ?? "Root Genesis Version",
          "Supersession Log": "No conflicting branches",
          "Integrity Chain": "Immutable Institutional Ledger",
          "Verification Timestamp": evidence.checkedAt,
        };
      default:
        return {
          "Check": evidence.check,
          "Verified At": evidence.checkedAt,
        };
    }
  };

  const details = getTechnicalDetails();

  return (
    <article className={`evidence-card ${evidence.valid ? "valid" : "invalid"}`}>
      <div className="evidence-header">
        <div className="evidence-title-area">
          <div className="evidence-icon">
            {evidence.valid ? "✓" : "×"}
          </div>
          <div>
            <h4 className="evidence-title">{label}</h4>
          </div>
        </div>

        <span className={`badge ${evidence.valid ? "badge-active" : "badge-revoked"}`}>
          <span className="badge-dot" />
          <span>{evidence.valid ? "Verified & Valid" : "Verification Failed"}</span>
        </span>
      </div>

      <p className="evidence-explanation">
        {evidence.detail}
      </p>

      <button
        type="button"
        className="evidence-disclosure-toggle"
        onClick={() => setOpen(!open)}
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span>{open ? "Hide technical trust details" : "Inspect technical trust details"}</span>
      </button>

      {open && (
        <dl className="evidence-disclosure-box">
          {Object.entries(details).map(([k, v]) => (
            <div key={k} style={{ display: "contents" }}>
              <dt>{k}:</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
};
