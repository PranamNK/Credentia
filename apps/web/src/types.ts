import type {
  CredentialLifecycle,
  Institution,
  VerificationEvidence,
  VerificationResult,
} from "@credentia/domain";

export type Role = "authority" | "institution" | "verifier";

export type AuthorityNav =
  | "dashboard"
  | "institutions"
  | "onboard"
  | "authorize-issuer"
  | "credentials"
  | "audit";

export type InstitutionNav =
  | "dashboard"
  | "credentials"
  | "issue"
  | "issuers"
  | "audit";

export type VerifierNav = "verify" | "history";

export type NavItem = AuthorityNav | InstitutionNav | VerifierNav;

export interface InstitutionRecord {
  id: string;
  name: string;
  code: string;
  type: string;
  country: string;
  state?: string;
  accreditationStatus: "ACCREDITED" | "PENDING" | "SUSPENDED" | "REVOKED";
  accreditationValidUntil?: string | null;
  authorizedIssuersCount: number;
  credentialsIssuedCount: number;
  did: string;
}

export interface IssuerRecord {
  id: string;
  institutionId: string;
  name: string;
  role: string;
  department: string;
  email: string;
  facultyId: string;
  did: string;
  keyStatus: "ACTIVE" | "ROTATED" | "REVOKED" | "COMPROMISED";
  permittedCredentialTypes: string[];
  validUntil: string;
}

export interface RegisteredCredentialItem {
  id: string;
  institutionId?: string;
  studentName: string;
  studentRollId: string;
  degree: string;
  issuedDate: string;
  issuerName: string;
  version: string;
  status: CredentialLifecycle;
  supersedesId?: string;
  rawCredential?: Record<string, unknown>;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  eventType: string;
  actor: string;
  entityId: string;
  details: string;
  verified: boolean;
}

export type Scenario =
  | "valid"
  | "tampered"
  | "revoked"
  | "suspended"
  | "expired"
  | "superseded"
  | "untrusted";
