import type { FC } from "react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase();

  let className = "badge badge-pending";
  let label = status;

  if (
    normalized === "active" ||
    normalized === "accredited" ||
    normalized === "approved" ||
    normalized === "valid"
  ) {
    className = "badge badge-active";
    label = normalized === "approved" ? "Accredited" : "Active";
  } else if (normalized === "pending" || normalized === "review") {
    className = "badge badge-pending";
    label = "Pending";
  } else if (normalized === "suspended") {
    className = "badge badge-suspended";
    label = "Suspended";
  } else if (normalized === "revoked") {
    className = "badge badge-revoked";
    label = "Revoked";
  } else if (normalized === "superseded") {
    className = "badge badge-superseded";
    label = "Superseded";
  } else if (normalized === "expired") {
    className = "badge badge-revoked";
    label = "Expired";
  }

  return (
    <span className={className}>
      <span className="badge-dot" />
      <span>{label}</span>
    </span>
  );
};
