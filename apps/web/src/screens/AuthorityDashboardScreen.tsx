import type { FC } from "react";
import { useState } from "react";
import { StatCard } from "../components/StatCard.js";
import { StatusBadge } from "../components/StatusBadge.js";
import type { InstitutionRecord } from "../types.js";

interface AuthorityDashboardScreenProps {
  institutions: InstitutionRecord[];
  onOnboardNew: () => void;
  onAuthorizeIssuer: (institutionId?: string) => void;
  onViewDossier: (inst: InstitutionRecord) => void;
  onUpdateStatus?: (did: string, status: "approved" | "revoked") => Promise<void>;
}

export const AuthorityDashboardScreen: FC<AuthorityDashboardScreenProps> = ({
  institutions,
  onOnboardNew,
  onAuthorizeIssuer,
  onViewDossier,
  onUpdateStatus,
}) => {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesFilter = filter === "ALL" || inst.accreditationStatus === filter;
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.code.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-content-layout">
      {/* 1. Page Heading + Actions */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Plan, monitor and oversee institutional accreditation trust with ease
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOnboardNew}
          >
            + Onboard Institution
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => alert("Institutional Trust Registry exported (JSON-LD format)")}
          >
            Export Registry
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Cards (Horizontal Row with 1st as Green Focal Anchor) */}
      <div className="stat-grid">
        <StatCard
          label="Total Accredited"
          value={institutions.length > 0 ? institutions.length : 84}
          subtext="5% increased from last month"
          isFocal={true}
        />
        <StatCard
          label="Active Accreditations"
          value={
            institutions.filter((i) => i.accreditationStatus === "ACCREDITED").length || 81
          }
          subtext="96.4% in good standing"
        />
        <StatCard
          label="Authorized Issuers"
          value="342"
          subtext="Active institutional signers"
        />
        <StatCard
          label="Expiring Soon"
          value="2"
          subtext="Pending 90-day review"
          trend="Review Due"
        />
      </div>

      {/* 3. Middle Modular Row: Accreditation Activity (Large) | Upcoming Reviews & Key Officers (Small) */}
      <div className="dashboard-modular-row">
        {/* Module 1: Accreditation Activity - Chunky Pill Bar Chart */}
        <div className="card analytics-chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Accreditation Activity</h3>
              <p className="card-subtitle">Verified credential and renewal volume</p>
            </div>
            <span className="chart-legend-badge">This Cycle</span>
          </div>

          <div className="bar-chart-container">
            <div className="bar-group">
              <div className="bar-pill" style={{ height: "65%" }} title="Sunday: 14 credentials" />
              <span className="bar-day-label">SUN</span>
            </div>
            <div className="bar-group">
              <div className="bar-pill" style={{ height: "82%" }} title="Monday: 28 credentials" />
              <span className="bar-day-label">MON</span>
            </div>
            <div className="bar-group">
              <div className="bar-pill" style={{ height: "55%" }} title="Tuesday: 18 credentials" />
              <span className="bar-day-label">TUE</span>
            </div>
            <div className="bar-group">
              <div className="bar-pill" style={{ height: "78%" }} title="Wednesday: 25 credentials" />
              <span className="bar-day-label">WED</span>
            </div>
            <div className="bar-group">
              {/* Focal bar in dark forest green */}
              <div className="bar-pill focal" style={{ height: "96%" }} title="Thursday: 42 credentials (Peak)" />
              <span className="bar-day-label" style={{ color: "#154332", fontWeight: 700 }}>THU</span>
            </div>
            <div className="bar-group">
              <div className="bar-pill" style={{ height: "45%" }} title="Friday: 15 credentials" />
              <span className="bar-day-label">FRI</span>
            </div>
            <div className="bar-group">
              <div className="bar-pill" style={{ height: "68%" }} title="Saturday: 22 credentials" />
              <span className="bar-day-label">SAT</span>
            </div>
          </div>
        </div>

        {/* Module 2: Upcoming Reviews + Key Institutional Officers */}
        <div className="card-stack-column">
          {/* Reminder / Upcoming Review */}
          <div className="card reminder-card">
            <div>
              <span className="reminder-eyebrow">Upcoming Review</span>
              <h4 className="reminder-title">Meridian University</h4>
              <p className="reminder-meta">Statutory Tier-1 Renewal · Due in 18 days</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => {
                const target = institutions.find((i) => i.accreditationStatus === "PENDING") || institutions[0];
                if (target) onViewDossier(target);
              }}
            >
              Review Dossier Now
            </button>
          </div>

          {/* Key Authorized Issuers / Contacts */}
          <div className="card collaborators-card">
            <div className="card-header" style={{ marginBottom: "12px" }}>
              <h3 className="card-title" style={{ fontSize: "14px" }}>Key Institutional Officers</h3>
            </div>
            <div className="collaborators-list">
              <div className="collaborator-item">
                <div className="collaborator-avatar">AR</div>
                <div className="collaborator-info">
                  <div className="collaborator-name">Dr. Ananya Rao</div>
                  <div className="collaborator-email">ananya.rao@wvit.edu.in</div>
                </div>
              </div>
              <div className="collaborator-item">
                <div className="collaborator-avatar">RI</div>
                <div className="collaborator-info">
                  <div className="collaborator-name">Prof. Ramesh Iyer</div>
                  <div className="collaborator-email">ramesh.iyer@rie.edu.in</div>
                </div>
              </div>
              <div className="collaborator-item">
                <div className="collaborator-avatar">KM</div>
                <div className="collaborator-info">
                  <div className="collaborator-name">Dr. Kiran Mehta</div>
                  <div className="collaborator-email">kiran.mehta@wvit.edu.in</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Lower Modular Row: Recent Institutions Table | Institutional Compliance Rate Arc */}
      <div className="dashboard-modular-row">
        {/* Left: Recent Institutions Module */}
        <div className="card table-module-card">
          <div className="card-header" style={{ marginBottom: "16px" }}>
            <div>
              <h3 className="card-title">Recent Institutions</h3>
              <p className="card-subtitle">Accreditation registry & verified university nodes</p>
            </div>
            <div className="table-search-pill">
              <input
                type="text"
                placeholder="Filter by name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-filter-pills">
            {["ALL", "ACCREDITED", "PENDING", "SUSPENDED"].map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-pill ${filter === st ? "active" : ""}`}
                onClick={() => setFilter(st)}
              >
                {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Code</th>
                <th>Status</th>
                <th>Issuers</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutions.slice(0, 4).map((inst) => (
                <tr key={inst.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="institution-badge-seal">🏛</div>
                      <div>
                        <div className="inst-name-text">{inst.name}</div>
                        <div className="inst-sub-text">
                          {inst.type} · {inst.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono-subtle">{inst.code}</td>
                  <td>
                    <StatusBadge status={inst.accreditationStatus} />
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{inst.authorizedIssuersCount}</span> officers
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewDossier(inst)}
                      >Manage</button>
                      <button
                        type="button"
                        className="btn btn-subtle btn-sm"
                        onClick={() => onAuthorizeIssuer(inst.id)}
                      >
                        + Issuer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Institutional Compliance Progress Gauge (Adaptrum-P3 Style) */}
        <div className="card gauge-module-card">
          <div className="card-header" style={{ width: "100%", marginBottom: "8px" }}>
            <div>
              <h3 className="card-title">Network Compliance</h3>
              <p className="card-subtitle">National Trust Standard</p>
            </div>
          </div>

          <div className="gauge-container">
            <svg viewBox="0 0 200 110" className="gauge-svg">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2f2e8"
                strokeWidth="22"
                strokeLinecap="round"
              />
              {/* Active Green Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#154332"
                strokeWidth="22"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset="28"
              />
            </svg>
            <div className="gauge-value-display">
              <div className="gauge-big-num">96.4%</div>
              <div className="gauge-label">Compliance Rate</div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-pill-outline"
            style={{ marginTop: "16px" }}
            onClick={() => alert("Full institutional compliance audit report generated.")}
          >
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

