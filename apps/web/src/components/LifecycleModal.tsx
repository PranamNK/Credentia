import type { FC } from "react";
import { useState } from "react";
import type { CredentialLifecycle } from "@credentia/domain";
import type { RegisteredCredentialItem } from "../types.js";

interface LifecycleModalProps {
  item: RegisteredCredentialItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: CredentialLifecycle, reason: string) => Promise<void>;
  onSupersede: (id: string, updatedDegree?: string) => Promise<void>;
}

export const LifecycleModal: FC<LifecycleModalProps> = ({
  item,
  onClose,
  onUpdateStatus,
  onSupersede,
}) => {
  const [action, setAction] = useState<"suspended" | "revoked" | "active" | "supersede">("suspended");
  const [reason, setReason] = useState("");
  const [newDegree, setNewDegree] = useState("");
  const [busy, setBusy] = useState(false);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (action === "supersede") {
        await onSupersede(item.id, newDegree || undefined);
      } else {
        await onUpdateStatus(item.id, action, reason || `Status updated to ${action}`);
      }
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="card-title">Manage Credential Lifecycle</h3>
            <p className="card-subtitle">
              {item.studentName} ({item.studentRollId}) · {item.id}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Current Status</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="demo-pill" style={{ textTransform: "capitalize" }}>
                  {item.status}
                </span>
                <span style={{ fontSize: "13px", color: "#64748b" }}>Version: {item.version}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Lifecycle Action</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button
                  type="button"
                  className={`btn ${action === "suspended" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setAction("suspended")}
                  style={{ justifyContent: "center" }}
                >
                  Suspend
                </button>
                <button
                  type="button"
                  className={`btn ${action === "revoked" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setAction("revoked")}
                  style={{ justifyContent: "center" }}
                >
                  Revoke
                </button>
                <button
                  type="button"
                  className={`btn ${action === "supersede" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setAction("supersede");
                    setNewDegree(item.degree);
                  }}
                  style={{ justifyContent: "center" }}
                >
                  Supersede (Reissue)
                </button>
                <button
                  type="button"
                  className={`btn ${action === "active" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setAction("active")}
                  style={{ justifyContent: "center" }}
                >
                  Reinstate (Active)
                </button>
              </div>
            </div>

            {action === "supersede" ? (
              <div className="form-group">
                <label className="form-label">Updated Degree Title</label>
                <input
                  className="form-input"
                  value={newDegree}
                  onChange={(e) => setNewDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Technology (Honors)"
                />
                <span className="form-help">
                  This will archive the current version and cryptographically link the new version.
                </span>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Reason / Justification</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide statutory justification for audit compliance..."
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Updating..." : "Confirm Lifecycle Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
