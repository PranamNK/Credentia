import type { FC } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
  trend?: string;
  isFocal?: boolean;
}

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  isFocal = false,
}) => {
  return (
    <div className={`stat-card ${isFocal ? "stat-card-focal" : ""}`}>
      <div className="stat-label">
        <span>{label}</span>
        {trend && (
          <span className={isFocal ? "stat-pill-focal" : "demo-pill"}>
            {trend}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-subtext">{subtext}</div>
    </div>
  );
};
