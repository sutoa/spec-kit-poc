import { db } from './index';

export async function seedInstitutions() {
  const institutions = [
    { id: "alpaca", name: "Alpaca", api_type: "api", auth_type: "api_key" },
    { id: "vanguard", name: "Vanguard", api_type: "manual", auth_type: "credentials" },
    { id: "tdtrade", name: "TD Trade", api_type: "manual", auth_type: "credentials" }
  ];

  for (const institution of institutions) {
    await db.run(
      `INSERT OR IGNORE INTO institutions (id, name, api_type, auth_type) VALUES (?, ?, ?, ?)`,
      institution.id,
      institution.name,
      institution.api_type,
      institution.auth_type
    );
  }
}