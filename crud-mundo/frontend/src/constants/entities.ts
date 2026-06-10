import type { Entity, RecordData } from "../types/entities";

export const entityLabels: Record<Entity, string> = {
  continentes: "Continentes",
  paises: "Países",
  cidades: "Cidades",
};

export const entitySingularLabels: Record<Entity, string> = {
  continentes: "continente",
  paises: "país",
  cidades: "cidade",
};

export const entitySubtitles: Record<Entity, string> = {
  continentes: "Grandes regiões que organizam sua base geográfica.",
  paises: "Dados demográficos e culturais conectados aos continentes.",
  cidades: "Localidades, população e coordenadas para explorar no mapa.",
};

export const entityColumns: Record<Entity, string[]> = {
  continentes: ["nome", "descricao"],
  paises: ["bandeira", "nome", "populacao", "idioma_oficial", "moeda", "continente_nome"],
  cidades: ["nome", "populacao", "latitude", "longitude", "pais_nome", "continente_nome"],
};

export const emptyForms: Record<Entity, RecordData> = {
  continentes: { nome: "", descricao: "" },
  paises: {
    nome: "",
    populacao: "",
    idioma_oficial: "",
    moeda: "",
    continente_id: "",
    bandeira: "",
  },
  cidades: {
    nome: "",
    populacao: "",
    latitude: "",
    longitude: "",
    pais_id: "",
  },
};
