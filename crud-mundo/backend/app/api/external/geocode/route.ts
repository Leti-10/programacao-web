import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/http";

export async function GET(request: Request) {
  const session = requireSession(request);
  if (session instanceof Response) return session;
  const url = new URL(request.url);
  const city = url.searchParams.get("city");
  const country = url.searchParams.get("country");
  if (!city || !country) return fail("Informe cidade e pais.");

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(`${city}, ${country}`)}`,
    { headers: { "User-Agent": "AtlasCRUD/1.0 (atividade academica)" } },
  );
  if (!response.ok) return fail("Falha ao consultar o mapa.", 502);
  const places = await response.json();
  if (!places.length) return fail("Local nao encontrado.", 404);
  return ok({
    latitude: Number(places[0].lat),
    longitude: Number(places[0].lon),
    nome_completo: places[0].display_name,
  });
}

