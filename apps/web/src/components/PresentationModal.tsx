import type { FC } from "react";
import type { getPresentation } from "../api.js";

interface PresentationModalProps {
  presentation: Awaited<ReturnType<typeof getPresentation>> | null;
  onClose: () => void;
  onVerify: (id: string) => void;
}

export const PresentationModal: FC<PresentationModalProps> = ({
  presentation,
  onClose,
  onVerify,
}) => {
  if (!presentation) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
        <div className="modal-header">
          <div>
            <h3 className="card-title">Academic Credential Certificate</h3>
            <p className="card-subtitle">Official verifiable institutional award</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              border: "2px solid #1b4332",
              borderRadius: "12px",
              padding: "32px",
              backgroundColor: "#ffffff",
              boxShadow: "inset 0 0 40px rgba(27, 67, 50, 0.02)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{ marginBottom: "16px", color: "#1b4332", fontWeight: 700, letterSpacing: "0.08em", fontSize: "12px", textTransform: "uppercase" }}>
              {presentation.institution}
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
              {presentation.title}
            </h2>

            <p style={{ fontSize: "14px", color: "#64748b", margin: "16px 0 6px" }}>
              This is to certify that
            </p>

            <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#1b4332", margin: "4px 0" }}>
              {presentation.recipientReference}
            </h3>

            <p style={{ fontSize: "14px", color: "#64748b", margin: "8px 0 16px" }}>
              has successfully fulfilled all requirements for the conferral of
            </p>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#0f172a",
                backgroundColor: "#f8f9fa",
                padding: "10px 16px",
                borderRadius: "8px",
                display: "inline-block",
                marginBottom: "24px",
              }}
            >
              {presentation.degree}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px",
                gap: "20px",
                textAlign: "left",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "20px",
                alignItems: "center",
              }}
            >
              <dl style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "6px 12px", fontSize: "12px" }}>
                <dt style={{ color: "#64748b" }}>Credential ID:</dt>
                <dd className="font-mono" style={{ fontWeight: 600 }}>{presentation.credentialId}</dd>

                <dt style={{ color: "#64748b" }}>Graduation Date:</dt>
                <dd style={{ fontWeight: 500 }}>{presentation.graduationDate}</dd>

                <dt style={{ color: "#64748b" }}>Version Lineage:</dt>
                <dd style={{ fontWeight: 500 }}>v{presentation.version} · {presentation.lifecycle.toUpperCase()}</dd>

                <dt style={{ color: "#64748b" }}>Status List Ref:</dt>
                <dd className="font-mono" style={{ color: "#059669" }}>Active on Ledger</dd>
              </dl>

              <div style={{ textAlign: "center" }}>
                <img
                  src={presentation.qrCodeDataUrl}
                  alt="Verification QR"
                  style={{ width: "110px", height: "110px", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                />
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>Scan to verify</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onVerify(presentation.credentialId);
            }}
          >
            Verify This Credential
          </button>
        </div>
      </div>
    </div>
  );
};
