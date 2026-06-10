import { requireSession } from "@/lib/auth";
import { pool } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/http";
import { definition, isResource, relationBelongsToUser, validateBody, valuesFor } from "@/lib/resources";

type Context = { params: Promise<{ resource: string }> };

export async function GET(request: Request, context: Context) {
  const session = requireSession(request);
  if (session instanceof Response) return session;
  const { resource } = await context.params;
  if (!isResource(resource)) return fail("Recurso nao encontrado.", 404);

  try {
    const def = definition(resource);
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim() ?? "";
    const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 8, 1), 50);
    const relation = url.searchParams.get("relation");
    const values: unknown[] = [session.userId];
    const where = [`${def.alias}.usuario_id = $1`];

    if (search) {
      values.push(`%${search}%`);
      where.push(`${def.alias}.nome ILIKE $${values.length}`);
    }
    if (relation && resource === "paises") {
      values.push(relation);
      where.push(`p.continente_id = $${values.length}`);
    }
    if (relation && resource === "cidades") {
      values.push(relation);
      where.push(`(ci.pais_id = $${values.length} OR p.continente_id = $${values.length})`);
    }

    const count = await pool.query(
      `SELECT COUNT(*) FROM ${def.from} WHERE ${where.join(" AND ")}`,
      values,
    );
    values.push(limit, (page - 1) * limit);
    const result = await pool.query(
      `SELECT ${def.select} FROM ${def.from}
       WHERE ${where.join(" AND ")}
       ORDER BY ${def.alias}.nome
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const total = Number(count.rows[0].count);
    return ok({ data: result.rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request, context: Context) {
  const session = requireSession(request);
  if (session instanceof Response) return session;
  const { resource } = await context.params;
  if (!isResource(resource)) return fail("Recurso nao encontrado.", 404);

  try {
    const body = await request.json();
    const validation = validateBody(resource, body);
    if (validation) return fail(validation, 422);
    if (!(await relationBelongsToUser(resource, body, session.userId))) {
      return fail("Relacionamento invalido.", 422);
    }
    const def = definition(resource);
    const fields = [...def.fields, "usuario_id"];
    const values = [...valuesFor(resource, body), session.userId];
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const result = await pool.query(
      `INSERT INTO ${def.table} (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values,
    );
    return ok(result.rows[0], 201);
  } catch (error) {
    return handleError(error);
  }
}

