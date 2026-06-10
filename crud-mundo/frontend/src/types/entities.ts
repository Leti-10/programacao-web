export type Entity = "continentes" | "paises" | "cidades";
export type RecordData = Record<string, string | number | null>;
export type Option = { id: number; nome: string };

export type ListResponse = {
  data: RecordData[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export type RestCountryOption = {
  nomePt: string;
  nomeEn: string;
};
