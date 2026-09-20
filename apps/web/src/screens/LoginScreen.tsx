import { useState } from "react";
import type { Role, InstitutionRecord } from "../types.js";

type Props = { onLogin: (role: Role, institution?: InstitutionRecord) => void; institutions: InstitutionRecord[] };

const accounts: Record<string, { role: Role; institutionId?: string }> = {
  "authority@credentia.demo": { role: "authority" },
  "verifier@credentia.demo": { role: "verifier" },
  "admin@wvit.edu.in": { role: "institution", institutionId: "INST-0001" },
  "admin@rie.edu.in": { role: "institution", institutionId: "INST-0002" },
  "admin@ehu.edu.in": { role: "institution", institutionId: "INST-0003" },
  "admin@git.edu.in": { role: "institution", institutionId: "INST-0004" },
};

export function LoginScreen({ onLogin, institutions }: Props) {
  const [role, setRole] = useState<Role>("authority");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const account = accounts[email.trim().toLowerCase()];
    if (!account || password !== "Credentia@123" || account.role !== role) {
      setError("Use the demo credentials shown below.");
      return;
    }
    const institution = account.institutionId
      ? institutions.find((item) => item.id === account.institutionId)
      : undefined;
    onLogin(account.role, institution);
  };
  return <div className="role-screen"><div className="role-card">
    <div className="eyebrow">CREDENTIA</div><h1>Sign in to your workspace</h1>
    <p className="muted">Choose your role to continue.</p>
    <div className="role-options">{(["authority", "institution", "verifier"] as Role[]).map((item) =>
      <button key={item} className={role === item ? "role-option selected" : "role-option"} onClick={() => setRole(item)}>
        {item === "authority" ? "Accreditation Authority" : item === "institution" ? "Institution / Issuer" : "Credential Verifier"}
      </button>)}</div>
    <form onSubmit={submit}><label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></label>
      <label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required /></label>
      {error && <p className="api-error-banner">{error}</p>}<button className="primary-button" type="submit">Sign in</button>
    </form>
  </div></div>;
}

