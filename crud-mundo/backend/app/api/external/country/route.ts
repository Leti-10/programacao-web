import { requireSession } from "@/lib/auth";
import { fail, ok } from "@/lib/http";

export async function GET(request: Request) {
  const session = requireSession(request);
  if (session instanceof Response) return session;
  const name = new URL(request.url).searchParams.get("name");
  if (!name) return fail("Informe o pais.");

  const response = await fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true&fields=name,flags,population,languages,currencies`,
    { next: { revalidate: 86400 } },
  );
  if (!response.ok) return fail("Pais nao encontrado na REST Countries.", 404);
  const countries = await response.json();
  const country = countries[0];
  return ok({
    nome: country.name.common,
    bandeira: country.flags.svg ?? country.flags.png,
    populacao: country.population,
    idioma_oficial: Object.values(country.languages ?? {}).join(", "),
    moeda: Object.values(country.currencies ?? {})
      .map((currency) => (currency as { name: string; symbol?: string }).symbol
        ? `${(currency as { name: string }).name} (${(currency as { symbol: string }).symbol})`
        : (currency as { name: string }).name)
      .join(", "),
  });
}

