import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleError(error: unknown) {
  console.error(error);
  const pgError = error as { code?: string };
  if (pgError.code === "23505") return fail("Ja existe um registro com esses dados.", 409);
  if (pgError.code === "23503") return fail("O registro esta relacionado a outro item.", 409);
  if (pgError.code === "23514") return fail("Um ou mais valores sao invalidos.", 422);
  return fail("Erro interno do servidor.", 500);
}

