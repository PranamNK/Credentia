import {
  PostgresCredentialStore,
  createDatabase,
} from "../../../packages/db/dist/index.js";
import { buildApp } from "./app.js";
import { institutions as institutionTable } from "../../../packages/db/dist/schema.js";
const database = process.env.DATABASE_URL
  ? createDatabase(process.env.DATABASE_URL)
  : undefined;
const institutionRows = database
  ? await database.db.select().from(institutionTable)
  : [];
const app = buildApp({
  credentials: database ? new PostgresCredentialStore(database.db) : undefined,
  institutions: institutionRows.map((row) => ({
    id: row.businessId ?? row.id,
    legalName: row.legalName,
    country: row.country,
    did: row.did,
    issuerAddress: row.issuerAddress,
    accreditationStatus: row.accreditationStatus,
    accreditationValidUntil: row.accreditationValidUntil?.toISOString(),
    code: row.code ?? row.businessId ?? row.id,
    type: row.type ?? "Institution",
  })),
});
await app.listen({
  port: Number(process.env.API_PORT ?? 3001),
  host: "0.0.0.0",
});
