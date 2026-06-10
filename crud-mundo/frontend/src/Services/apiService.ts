const baseUrl = import.meta.env.VITE_API_URL ?? "";

type ApiError = { error: string };

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("atlas_token");
  const response = await fetch(`${baseUrl}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error((body as ApiError).error ?? "Erro na requisição.");
  }

  return body as T;
}
