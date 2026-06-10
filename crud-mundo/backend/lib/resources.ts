import { pool } from "./db";

export type Resource = "continentes" | "paises" | "cidades";

export function isResource(value: string): value is Resource {
  return ["continentes", "paises", "cidades"].includes(value);
}

const definitions = {
  continentes: {
    table: "continente",
    fields: ["nome", "descricao"],
    required: ["nome", "descricao"],
    select: "c.*",
    from: "continente c",
    alias: "c",
  },
  paises: {
    table: "pais",
    fields: ["nome", "populacao", "idioma_oficial", "moeda", "continente_id", "bandeira"],
    required: ["nome", "populacao", "idioma_oficial", "moeda", "continente_id"],
    select: "p.*, c.nome AS continente_nome",
    from: "pais p JOIN continente c ON c.id = p.continente_id",
    alias: "p",
  },
  cidades: {
    table: "cidade",
    fields: ["nome", "populacao", "latitude", "longitude", "pais_id"],
    required: ["nome", "populacao", "latitude", "longitude", "pais_id"],
    select: "ci.*, p.nome AS pais_nome, c.nome AS continente_nome",
    from: "cidade ci JOIN pais p ON p.id = ci.pais_id JOIN continente c ON c.id = p.continente_id",
    alias: "ci",
  },
} as const;

export function definition(resource: Resource) {
  return definitions[resource];
}

export function validateBody(resource: Resource, body: Record<string, unknown>) {
  const def = definition(resource);
  const missing = def.required.filter((field) => body[field] === undefined || body[field] === "");
  if (missing.length) return `Campos obrigatorios: ${missing.join(", ")}.`;
  return null;
}

export function valuesFor(resource: Resource, body: Record<string, unknown>) {
  return definition(resource).fields.map((field) => body[field] ?? null);
}

export async function relationBelongsToUser(resource: Resource, body: Record<string, unknown>, userId: number) {
  if (resource === "continentes") return true;
  const table = resource === "paises" ? "continente" : "pais";
  const id = resource === "paises" ? body.continente_id : body.pais_id;
  const result = await pool.query(`SELECT id FROM ${table} WHERE id = $1 AND usuario_id = $2`, [id, userId]);
  return Boolean(result.rowCount);
}

