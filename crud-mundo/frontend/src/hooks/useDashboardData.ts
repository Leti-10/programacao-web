import { useCallback, useEffect, useState } from "react";
import { api } from "../Services/apiService";
import type { Entity, ListResponse, Option, RecordData } from "../types/entities";

export function useDashboardData(entity: Entity) {
  const [records, setRecords] = useState<RecordData[]>([]);
  const [continents, setContinents] = useState<Option[]>([]);
  const [countries, setCountries] = useState<Option[]>([]);
  const [search, setSearch] = useState("");
  const [relation, setRelation] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOptions = useCallback(async () => {
    const [continentData, countryData] = await Promise.all([
      api<ListResponse>("/continentes?limit=100"),
      api<ListResponse>("/paises?limit=100"),
    ]);
    setContinents(
      continentData.data.map(({ id, nome }) => ({ id: Number(id), nome: String(nome) })),
    );
    setCountries(countryData.data.map(({ id, nome }) => ({ id: Number(id), nome: String(nome) })));
  }, []);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "8" });
      if (search) params.set("search", search);
      if (relation) params.set("relation", relation);
      const result = await api<ListResponse>(`/${entity}?${params}`);
      setRecords(result.data);
      setPages(Math.max(result.pagination.pages, 1));
      setTotal(result.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [entity, page, relation, search]);

  useEffect(() => {
    loadOptions().catch(() => undefined);
  }, [loadOptions]);
  useEffect(() => {
    const timer = setTimeout(loadRecords, 250);
    return () => clearTimeout(timer);
  }, [loadRecords]);
  useEffect(() => {
    setPage(1);
    setRelation("");
    setSearch("");
  }, [entity]);

  async function remove(record: RecordData) {
    if (!confirm(`Excluir "${record.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await api(`/${entity}/${record.id}`, { method: "DELETE" });
      await Promise.all([loadRecords(), loadOptions()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir.");
    }
  }

  function refresh() {
    return Promise.all([loadRecords(), loadOptions()]);
  }

  return {
    records,
    continents,
    countries,
    search,
    relation,
    page,
    pages,
    total,
    loading,
    error,
    setSearch,
    setRelation,
    setPage,
    remove,
    refresh,
  };
}
