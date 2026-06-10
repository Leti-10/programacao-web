import { requireSession } from "@/lib/auth";
import { pool } from "@/lib/db";
import { fail, handleError, ok } from "@/lib/http";
import { definition, isResource, relationBelongsToUser, validateBody, valuesFor } from "@/lib/resources";

type Context = { params: Promise<{ resource: string; id: string }> };

export async function PUT(request: Request, context: Context) {
  const session = requireSession(request);
  if (session instanceof Response) return session;
  const { resource, id } = await context.params;
  if (!isResource(resource)) return fail("Recurso nao encontrado.", 404);

  try {
    const body = await request.json();
    const validation = validateBody(resource, body);
    if (validation) return fail(validation, 422);
    if (!(await relationBelongsToUser(resource, body, session.userId))) {
      return fail("Relacionamento invalido.", 422);
    }
    const def = definition(resource);
    const values = valuesFor(resource, body);
    const setters = def.fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
    values.push(id, session.userId);
    const result = await pool.query(
      `UPDATE ${def.table} SET ${setters}
       WHERE id = $${values.length - 1} AND usuario_id = $${values.length}
       RETURNING *`,
      values,
    );
    if (!result.rowCount) return fail("Registro nao encontrado.", 404);
    return ok(result.rows[0]);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  const session = requireSession(request);
  if (session instanceof Response) return session;
  const { resource, id } = await context.params;
  if (!isResource(resource)) return fail("Recurso nao encontrado.", 404);

  try {
    const def = definition(resource);
    const result = await pool.query(
      `DELETE FROM ${def.table} WHERE id = $1 AND usuario_id = $2 RETURNING id`,
      [id, session.userId],
    );
    if (!result.rowCount) return fail("Registro nao encontrado.", 404);
    return ok({ message: "Registro excluido." });
  } catch (error) {
    return handleError(error);
  }
}

