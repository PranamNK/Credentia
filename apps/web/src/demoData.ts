import syntheticData from "../../../packages/db/seed/data/synthetic_academic_data.json" with {
  type: "json",
};
import type {
  InstitutionRecord,
  IssuerRecord,
  RegisteredCredentialItem,
  Scenario,
} from "./types.js";

// Student name lookup
const studentMap = new Map<string, string>();
for (const s of syntheticData.students) {
  studentMap.set(s.student_id, s.name);
}

// Issuer name lookup
const issuerMap = new Map<
  string,
  { name: string; role: string; did: string }
>();
for (const iss of syntheticData.issuers) {
  issuerMap.set(iss.issuer_id, {
    name: iss.name,
    role: iss.role,
    did: iss.did,
  });
}

// Map canonical institutions
export const canonicalInstitutions: InstitutionRecord[] =
  syntheticData.institutions.map((inst) => {
    const issuerCount = syntheticData.issuers.filter(
      (iss) => iss.institution_id === inst.institution_id,
    ).length;
    const credentialCount = syntheticData.credentials.filter(
      (c) => c.institution_id === inst.institution_id,
    ).length;

    return {
      id: inst.institution_id,
      name: inst.name,
      code: inst.code,
      type: inst.type,
      country: inst.country,
      state: inst.state,
      accreditationStatus:
        inst.accreditation_status as InstitutionRecord["accreditationStatus"],
      accreditationValidUntil: inst.accreditation_valid_until,
      authorizedIssuersCount: issuerCount,
      credentialsIssuedCount: credentialCount,
      did: `did:web:${inst.code.toLowerCase()}.edu.in`,
    };
  });

// Map canonical issuers
export const canonicalIssuers: IssuerRecord[] = syntheticData.issuers.map(
  (iss) => ({
    id: iss.issuer_id,
    institutionId: iss.institution_id,
    name: iss.name,
    role: iss.role,
    department: "Academic Administration",
    email: `${iss.name.toLowerCase().replace(/[^a-z]/g, ".")}@${iss.institution_id.toLowerCase()}.edu.in`,
    facultyId: `FAC-${iss.issuer_id}`,
    did: iss.did,
    keyStatus: iss.key_status as IssuerRecord["keyStatus"],
    permittedCredentialTypes: [
      "Bachelor of Technology",
      "Master of Technology",
      "Bachelor of Science",
      "Academic Transcripts",
    ],
    validUntil: "2029-12-31",
  }),
);

// Map canonical credentials
export const canonicalCredentials: RegisteredCredentialItem[] =
  syntheticData.credentials.map((c) => {
    const studentName = studentMap.get(c.student_id) ?? "Academic Graduate";
    const issuerInfo = issuerMap.get(c.issuer_id) ?? {
      name: "Registrar Office",
      role: "Signing Officer",
      did: "did:web:institution.edu",
    };

    return {
      id: c.credential_id,
      institutionId: c.institution_id,
      studentName,
      studentRollId: c.student_id,
      degree: `${c.degree} in ${c.field_of_study}`,
      issuedDate: c.issue_date,
      issuerName: `${issuerInfo.name} (${issuerInfo.role})`,
      version: `v${c.current_version}.0`,
      status:
        c.current_status.toLowerCase() as RegisteredCredentialItem["status"],
    };
  });

// Canonical fixtures for non-mutating verification scenarios
export const scenarioFixtures: Record<
  Scenario,
  {
    credentialId: string;
    studentName: string;
    degree: string;
    description: string;
    expectedTrusted: boolean;
  }
> = {
  valid: {
    credentialId: "CRD-00001",
    studentName: "Aarav Sharma",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    description:
      "Valid, untampered active credential anchored to accredited institution.",
    expectedTrusted: true,
  },
  tampered: {
    credentialId: "CRD-00001",
    studentName: "Aarav Sharma",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    description: "Signature mismatch: Digest and Ed25519 signature tampered.",
    expectedTrusted: false,
  },
  revoked: {
    credentialId: "CRD-00012",
    studentName: "Pooja Deshmukh",
    degree:
      "Bachelor of Technology in Electronics and Communication Engineering",
    description:
      "Statutory revocation: Revoked by Dean due to administrative review.",
    expectedTrusted: false,
  },
  suspended: {
    credentialId: "CRD-00014",
    studentName: "Ananya Pillai",
    degree: "Bachelor of Technology in Mechanical Engineering",
    description: "Temporary suspension: Flagged under institutional review.",
    expectedTrusted: false,
  },
  expired: {
    credentialId: "CRD-00015",
    studentName: "Karthik Nair",
    degree: "Bachelor of Science in Data Science",
    description:
      "Validity expired: Time-limited certification validity exceeded.",
    expectedTrusted: false,
  },
  superseded: {
    credentialId: "CRD-00011",
    studentName: "Sneha Reddy",
    degree: "Bachelor of Technology in Information Technology",
    description:
      "Superseded: Prior version replaced by cryptographically linked v2.0.",
    expectedTrusted: false,
  },
  untrusted: {
    credentialId: "CRD-00057",
    studentName: "Vineeta Nair",
    degree: "Bachelor of Technology in Computer Science",
    description:
      "Institution suspended: GreenField Institute of Technology accreditation revoked/suspended.",
    expectedTrusted: false,
  },
};
