import { useState, useEffect } from "react";
import type {
  CredentialLifecycle,
  VerificationResult,
} from "@credentia/domain";
import {
  issueCredential,
  getPresentation,
  updateCredentialStatus,
  supersedeCredential,
  verifyCredentialReference,
  verifyCredentialPayload,
  listCredentials,
  listInstitutions,
} from "./api.js";
import {
  canonicalInstitutions,
  canonicalIssuers,
  canonicalCredentials,
  scenarioFixtures,
} from "./demoData.js";
import type {
  Role,
  NavItem,
  InstitutionRecord,
  IssuerRecord,
  RegisteredCredentialItem,
  Scenario,
} from "./types.js";

// Components
import { TopBar } from "./components/TopBar.js";
import { Sidebar } from "./components/Sidebar.js";
import { PresentationModal } from "./components/PresentationModal.js";
import { LifecycleModal } from "./components/LifecycleModal.js";

// Screens
import { RoleSelectionScreen } from "./screens/RoleSelectionScreen.js";
import { LoginScreen } from "./screens/LoginScreen.js";
import { AuthorityDashboardScreen } from "./screens/AuthorityDashboardScreen.js";
import { OnboardInstitutionScreen } from "./screens/OnboardInstitutionScreen.js";
import { AuthorizeIssuerScreen } from "./screens/AuthorizeIssuerScreen.js";
import { InstitutionCredentialsScreen } from "./screens/InstitutionCredentialsScreen.js";
import { EvidenceVerificationScreen } from "./screens/EvidenceVerificationScreen.js";
import { InstitutionAdminScreen } from "./screens/InstitutionAdminScreen.js";

export function App() {
  const [currentRole, setCurrentRole] = useState<Role>("authority");
  const [authenticated, setAuthenticated] = useState(false);
  const [currentNav, setCurrentNav] = useState<NavItem | "role-select">(
    "dashboard",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeInstitution, setActiveInstitution] = useState<InstitutionRecord>(
    canonicalInstitutions[0]!,
  );
  const [managedInstitution, setManagedInstitution] = useState<InstitutionRecord | null>(null);

  // App State initialized with canonical synthetic data
  const [institutions, setInstitutions] = useState<InstitutionRecord[]>(
    canonicalInstitutions,
  );
  const [issuers, setIssuers] = useState<IssuerRecord[]>(canonicalIssuers);
  const [credentials, setCredentials] =
    useState<RegisteredCredentialItem[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  useEffect(() => {
    void listInstitutions().then((rows) => {
      if (rows.length) setInstitutions(rows.map((row) => ({ id: row.id, name: row.legalName, code: row.id, type: "Institution", country: row.country, accreditationStatus: row.accreditationStatus === "approved" ? "ACCREDITED" : "PENDING", accreditationValidUntil: row.validUntil, authorizedIssuersCount: 0, credentialsIssuedCount: 0, did: row.did })));
    }).catch(() => undefined);
    void listCredentials()
      .then((records) => {
        setCredentials(
          records.map(({ credential, lifecycle }) => {
            const subject = credential.credentialSubject as {
              id?: string;
              givenName?: string;
              degree?: string;
            };
            return {
              id: String(credential.id),
              institutionId: canonicalInstitutions.find((i) =>
                String(credential.issuer ?? "").includes(
                  i.did.replace("did:web:", ""),
                ),
              )?.id,
              studentName: subject.givenName ?? "Credential holder",
              studentRollId: subject.id ?? "",
              degree: subject.degree ?? "Academic credential",
              issuedDate: String(credential.validFrom).slice(0, 10),
              issuerName: String(credential.issuer),
              version: `v${credential.credentialVersion ?? 1}.0`,
              status: lifecycle,
              rawCredential: credential,
            };
          }),
        );
      })
      .catch(() => setApiError("Unable to connect to Credentia API."));
  }, []);

  // Verification state
  const [verifyReference, setVerifyReference] = useState("CRD-00001");
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [verifyBusy, setVerifyBusy] = useState(false);

  // Modals
  const [presentationData, setPresentationData] = useState<Awaited<
    ReturnType<typeof getPresentation>
  > | null>(null);

  const [activeLifecycleItem, setActiveLifecycleItem] =
    useState<RegisteredCredentialItem | null>(null);

  // Handlers for real API calls
  const handleVerifyReference = async (ref: string) => {
    setVerifyBusy(true);
    try {
      const res = await verifyCredentialReference(ref);
      setVerificationResult(res);
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setVerifyBusy(false);
    }
  };

  const handleRunScenario = async (scenario: Scenario) => {
    setVerifyBusy(true);
    try {
      const fixture = scenarioFixtures[scenario];
      setVerifyReference(fixture.credentialId);

      if (scenario === "tampered") {
        // Send tampered payload directly to verify
        const res = await verifyCredentialPayload({
          id: fixture.credentialId,
          type: ["VerifiableCredential", "AcademicDegreeCredential"],
          issuer: "did:web:attacker-untrusted.example",
          proof: {
            type: "Ed25519Signature2020",
            proofValue:
              "0xdeadbeefbadsignature0000000000000000000000000000000000000000000000",
          },
        });
        setVerificationResult(res);
      } else {
        const res = await verifyCredentialReference(fixture.credentialId);
        setVerificationResult(res);
      }
    } catch {
      // Ensure honest feedback from the backend verify endpoint
      try {
        const res = await verifyCredentialReference(
          scenarioFixtures[scenario].credentialId,
        );
        setVerificationResult(res);
      } catch (err) {
        console.error("Scenario evaluation:", err);
      }
    } finally {
      setVerifyBusy(false);
    }
  };

  const handleIssueCredential = async (input: {
    studentName: string;
    studentId: string;
    degree: string;
    graduationDate: string;
    issuerDid: string;
    issuerName: string;
  }) => {
    try {
      const issued = await issueCredential({
        issuer: input.issuerDid,
        subject: {
          id: input.studentId,
          degree: input.degree,
          graduationDate: input.graduationDate,
        },
      });

      const newId = String(
        issued.credential.id ?? `CRD-${Date.now().toString().slice(-5)}`,
      );
      const newItem: RegisteredCredentialItem = {
        id: newId,
        studentName: input.studentName,
        studentRollId: input.studentId,
        degree: input.degree,
        issuedDate: input.graduationDate,
        issuerName: input.issuerName,
        institutionId: activeInstitution.id,
        version: "v1.0",
        status: "active",
        rawCredential: issued.credential,
      };

      setCredentials((prev) => [newItem, ...prev]);

      // Fetch presentation
      const pres = await getPresentation(newId);
      setPresentationData(pres);
    } catch (err) {
      alert(
        `Issuance failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const handleViewPresentation = async (id: string) => {
    try {
      const pres = await getPresentation(id);
      setPresentationData(pres);
    } catch (err) {
      alert(
        `Presentation unavailable: ${err instanceof Error ? err.message : "Request failed"}`,
      );
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: CredentialLifecycle,
    reason: string,
  ) => {
    try {
      await updateCredentialStatus(id, status, reason);
      setCredentials((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c)),
      );
    } catch (err) {
      alert(
        `Status update failed: ${err instanceof Error ? err.message : "Request failed"}`,
      );
    }
  };

  const handleSupersede = async (id: string, updatedDegree?: string) => {
    try {
      await supersedeCredential(id, {
        subject: {
          id: "STU-0001",
          degree: updatedDegree || "Master of Technology (Honors)",
          graduationDate: "2026-06-01",
        },
      });

      setCredentials((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "superseded",
                version: "v1.0 (superseded)",
              }
            : c,
        ),
      );
    } catch (err) {
      alert(
        `Supersession failed: ${err instanceof Error ? err.message : "Request failed"}`,
      );
    }
  };

  if (!authenticated) {
    return <LoginScreen institutions={institutions} onLogin={(role, institution) => {
      setAuthenticated(true);
      setCurrentRole(role);
      if (institution) setActiveInstitution(institution);
      setCurrentNav(role === "verifier" ? "verify" : role === "institution" ? "credentials" : "dashboard");
    }} />;
  }

  // If in role select mode
  if (currentNav === "role-select") {
    return (
      <RoleSelectionScreen
        institutions={institutions}
        onSelectInstitution={setActiveInstitution}
        onSelectRole={(role) => {
          setCurrentRole(role);
          setCurrentNav(role === "verifier" ? "verify" : role === "institution" ? "credentials" : "dashboard");
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      {apiError && <div className="api-error-banner">{apiError}</div>}
      {/* Sidebar with Donezo light neutral aesthetic */}
      <Sidebar
        currentRole={currentRole}
        currentNav={currentNav as NavItem}
        onNavigate={(nav) => setCurrentNav(nav)}
        onSwitchRole={() => setAuthenticated(false)}
        institutionName={activeInstitution.name}
        institutionId={activeInstitution.id}
      />

      <div className="main-layout">
        {/* TopBar with search pill, mail & bell utility icons, and profile info */}
        <TopBar
          currentRole={currentRole}
          onSwitchRole={() => setAuthenticated(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          institutionName={activeInstitution.name}
        />

        <main className="content-workspace">
          {/* Authority Persona Screens */}
          {currentRole === "authority" && (
            <>
              {currentNav === "dashboard" && (
                <AuthorityDashboardScreen
                  institutions={institutions}
                  onOnboardNew={() => setCurrentNav("onboard")}
                  onAuthorizeIssuer={(instId) =>
                    setCurrentNav("authorize-issuer")
                  }
                  onViewDossier={(inst) => {
                    setManagedInstitution(inst);
                    setCurrentNav("institutions");
                  }}
                />
              )}

              {currentNav === "onboard" && (
                <OnboardInstitutionScreen
                  onSuccess={(newInst) => {
                    setInstitutions((prev) => [newInst, ...prev]);
                    setCurrentNav("dashboard");
                  }}
                  onNavigateToAuthorize={(instId) =>
                    setCurrentNav("authorize-issuer")
                  }
                  onCancel={() => setCurrentNav("dashboard")}
                />
              )}

              {currentNav === "authorize-issuer" && (
                <AuthorizeIssuerScreen
                  onSuccess={(newIssuer) => {
                    setIssuers((prev) => [newIssuer, ...prev]);
                    setCurrentNav("dashboard");
                  }}
                  onNavigateToIssue={() => {
                    setCurrentRole("institution");
                    setCurrentNav("credentials");
                  }}
                  onCancel={() => setCurrentNav("dashboard")}
                />
              )}

              {currentNav === "institutions" && managedInstitution ? (
                <InstitutionAdminScreen institution={managedInstitution} issuers={issuers} onBack={() => { setManagedInstitution(null); setCurrentNav("dashboard"); }} />
              ) : (currentNav === "institutions" ||
                currentNav === "credentials" ||
                currentNav === "audit") && (
                <AuthorityDashboardScreen
                  institutions={institutions}
                  onOnboardNew={() => setCurrentNav("onboard")}
                  onAuthorizeIssuer={(instId) =>
                    setCurrentNav("authorize-issuer")
                  }
                  onViewDossier={(inst) => {
                    setManagedInstitution(inst);
                    setCurrentNav("institutions");
                  }}
                />
              )}
            </>
          )}

          {/* Institution Persona Screens */}
          {currentRole === "institution" && (
            <>
              {(currentNav === "dashboard" ||
                currentNav === "credentials" ||
                currentNav === "issue" ||
                currentNav === "audit") && (
                <InstitutionCredentialsScreen
                  key={currentNav}
                  institutionName={activeInstitution.name}
                  institutionCode={activeInstitution.id}
                  initialTab={currentNav === "issue" ? "issue" : "registry"}
                  credentials={credentials.filter(
                    (credential) =>
                      credential.institutionId === activeInstitution.id,
                  )}
                  onIssueCredential={handleIssueCredential}
                  onViewPresentation={handleViewPresentation}
                  onVerifyCredential={(id) => {
                    setVerifyReference(id);
                    setCurrentRole("verifier");
                    setCurrentNav("verify");
                    void handleVerifyReference(id);
                  }}
                  onManageLifecycle={(item) => setActiveLifecycleItem(item)}
                />
              )}

              {currentNav === "issuers" && (
                <AuthorizeIssuerScreen
                  onSuccess={(newIssuer) => {
                    setIssuers((prev) => [newIssuer, ...prev]);
                    setCurrentNav("credentials");
                  }}
                  onNavigateToIssue={() => setCurrentNav("credentials")}
                  onCancel={() => setCurrentNav("credentials")}
                />
              )}
            </>
          )}

          {/* Verifier Persona Screens */}
          {currentRole === "verifier" && (
            <EvidenceVerificationScreen
              reference={verifyReference}
              onReferenceChange={setVerifyReference}
              onVerify={() => handleVerifyReference(verifyReference)}
              onRunScenario={handleRunScenario}
              result={verificationResult}
              busy={verifyBusy}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {presentationData && (
        <PresentationModal
          presentation={presentationData}
          onClose={() => setPresentationData(null)}
          onVerify={(id) => {
            setPresentationData(null);
            setVerifyReference(id);
            setCurrentRole("verifier");
            setCurrentNav("verify");
            void handleVerifyReference(id);
          }}
        />
      )}

      {activeLifecycleItem && (
        <LifecycleModal
          item={activeLifecycleItem}
          onClose={() => setActiveLifecycleItem(null)}
          onUpdateStatus={handleUpdateStatus}
          onSupersede={handleSupersede}
        />
      )}
    </div>
  );
}
