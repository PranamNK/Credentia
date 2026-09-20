import type { FC } from "react";
import type { NavItem, Role } from "../types.js";

interface SidebarProps {
  currentRole: Role;
  currentNav: NavItem;
  onNavigate: (nav: NavItem) => void;
  onSwitchRole: () => void;
  institutionName?: string;
  institutionId?: string;
}

export const Sidebar: FC<SidebarProps> = ({
  currentRole,
  currentNav,
  onNavigate,
  onSwitchRole,
  institutionName = "Institution",
  institutionId = "",
}) => {
  const roleContextMap: Record<Role, { label: string; context: string }> = {
    authority: {
      label: "Accreditation Authority",
      context: "National Board (NHEAC)",
    },
    institution: {
      label: "Educational Institution",
      context: `${institutionName}${institutionId ? ` (${institutionId})` : ""}`,
    },
    verifier: {
      label: "Credential Verifier",
      context: "Credential Inspection Portal",
    },
  };

  const getNavLinks = (): Array<{ id: NavItem; label: string; icon: JSX.Element }> => {
    if (currentRole === "authority") {
      return [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          ),
        },
        {
          id: "institutions",
          label: "Institutions",
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          ),
        },
        {
          id: "onboard",
          label: "Onboard Institution",
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
        {
          id: "authorize-issuer",
          label: "Authorize Issuer",
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ),
        },
        {
          id: "credentials",
          label: "Credentials",
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
        },
        {
          id: "audit",
          label: "Audit Trail",
          icon: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
      ];
    }

    if (currentRole === "institution") {
      return [
        {
          id: "credentials" as NavItem,
          label: "Credential Center",
          icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        },
        {
          id: "issue" as NavItem,
          label: "Issue Credential",
          icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
        },
      ];
    }
    return [
      {
        id: "verify",
        label: "Verify Credential",
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        id: "history",
        label: "Verification History",
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-seal-ring">
          <div className="brand-seal-inner" />
        </div>
        <span className="brand-name">Credentia</span>
      </div>

      <div className="sidebar-section-title">Menu</div>

      <nav className="sidebar-nav">
        {navLinks.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link ${currentNav === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-section-title">General</div>

      <div className="sidebar-general-nav">
        <button
          type="button"
          className="nav-link"
          onClick={() => alert("Platform Settings: Production mode enabled with cryptographic anchoring")}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="nav-link"
          onClick={onSwitchRole}
          title="Switch active role context"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Help / Persona</span>
        </button>
      </div>

      <div className="sidebar-role-indicator">
        <span className="sidebar-role-label">
          {roleContextMap[currentRole].label}
        </span>
        <span className="sidebar-role-context">
          {roleContextMap[currentRole].context}
        </span>
      </div>
    </aside>
  );
};


