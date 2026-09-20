import {
  type CredentialLifecycle,
  type VerificationResult,
  credentialPresentationSchema,
  issueCredentialRequestSchema,
  verificationResultSchema,
} from "@credentia/domain";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface IssuedRecord {
  credential: Record<string, unknown>;
  lifecycle: CredentialLifecycle;
  verificationUrl: string;
  qrCodeDataUrl: string;
}

export interface ApiInstitution {
  id: string;
  legalName: string;
  country: string;
  did: string;
  createdAt: string;
  accreditationStatus?: "approved" | "pending" | "revoked";
  validUntil?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? "Request failed");
  return body as T;
}

export function issueCredential(input: unknown) {
  return request<IssuedRecord>("/credentials", {
    method: "POST",
    body: JSON.stringify(issueCredentialRequestSchema.parse(input)),
  });
}

export function getPresentation(id: string) {
  return request(`/credentials/${encodeURIComponent(id)}/presentation`).then(
    (value) => credentialPresentationSchema.parse(value),
  );
}
export function listCredentials() {
  return request<
    Array<{
      credential: Record<string, unknown>;
      lifecycle: CredentialLifecycle;
    }>
  >("/credentials");
}

export function verifyCredentialReference(credentialId: string) {
  return request<VerificationResult>("/verify", {
    method: "POST",
    body: JSON.stringify({ credentialId }),
  }).then((value) => verificationResultSchema.parse(value));
}

export function verifyCredentialPayload(credential: Record<string, unknown>) {
  return request<VerificationResult>("/verify", {
    method: "POST",
    body: JSON.stringify({ credential }),
  }).then((value) => verificationResultSchema.parse(value));
}

export function updateCredentialStatus(
  id: string,
  status: CredentialLifecycle,
  reason?: string,
) {
  return request(`/credentials/${encodeURIComponent(id)}/status`, {
    method: "POST",
    body: JSON.stringify({ status, reason }),
  });
}

export function supersedeCredential(
  id: string,
  input: {
    subject?: {
      id: string;
      givenName?: string;
      degree: string;
      graduationDate: string;
    };
    validFrom?: string;
  } = {},
) {
  return request<IssuedRecord>(
    `/credentials/${encodeURIComponent(id)}/supersede`,
    { method: "POST", body: JSON.stringify(input) },
  );
}

export function getCredentialVersions(id: string) {
  return request<{
    credentialId: string;
    versions: Array<{
      id: string;
      version: number;
      lifecycle: CredentialLifecycle;
      issuedAt: string;
      supersedesCredentialId?: string;
      supersededByCredentialId?: string;
    }>;
  }>(`/credentials/${encodeURIComponent(id)}/versions`);
}

export function listInstitutions() {
  return request<ApiInstitution[]>("/institutions");
}

export function registerInstitution(input: {
  legalName: string;
  country: string;
  did: string;
  issuerAddress: string;
  validUntil?: string;
}) {
  return request<{
    institution: ApiInstitution;
    accreditation?: unknown;
  }>("/institutions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateInstitutionStatus(
  did: string,
  status: "approved" | "revoked",
) {
  return request(`/institutions/${encodeURIComponent(did)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
