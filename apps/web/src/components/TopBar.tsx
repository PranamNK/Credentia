import type { FC } from "react";
import type { Role } from "../types.js";

interface TopBarProps {
  currentRole: Role;
  onSwitchRole: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  institutionName?: string;
}

export const TopBar: FC<TopBarProps> = ({
  currentRole,
  onSwitchRole,
  searchQuery = "",
  onSearchChange,
  institutionName = "Institution",
}) => {
  const profileDetails: Record<Role, { name: string; email: string; initials: string; org: string }> = {
    authority: {
      name: "Dr. Arthur Vance",
      email: "arthur.vance@nheac.gov",
      initials: "AV",
      org: "NHEAC Authority",
    },
    institution: {
      name: "Dr. Ananya Rao",
      email: "ananya.rao@wvit.edu.in",
      initials: "AR",
      org: institutionName,
    },
    verifier: {
      name: "Admissions & Verification",
      email: "verifier@portal.edu",
      initials: "VP",
      org: "Trust Verifier Portal",
    },
  };

  const currentProfile = profileDetails[currentRole];

  return (
    <header className="topbar">
      <div className="topbar-search">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search institutions, credentials, or IDs..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <div className="topbar-utilities">
          <button
            type="button"
            className="topbar-icon-btn"
            title="Messages"
            onClick={() => alert("No unread messages")}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="topbar-icon-btn"
            title="Notifications"
            onClick={() => alert("2 accreditation notifications pending review")}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="notification-dot" />
          </button>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onSwitchRole}
          title="Change active persona"
        >
          Switch Role
        </button>

        <div className="user-profile-badge">
          <div className="user-avatar">{currentProfile.initials}</div>
          <div className="user-info-col">
            <span className="user-name">{currentProfile.name}</span>
            <span className="user-email">{currentProfile.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
