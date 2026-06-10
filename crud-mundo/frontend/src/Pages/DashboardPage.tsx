import { useState } from "react";
import DashboardLayout from "../Components/layout/DashboardLayout";
import EntityForm from "../Components/forms/EntityForm";
import DataPanel from "../Components/dashboard/DataPanel";
import MapCard from "../Components/dashboard/MapCard";
import PageHeader from "../Components/dashboard/PageHeader";
import StatsGrid from "../Components/dashboard/StatsGrid";
import { useDashboardData } from "../hooks/useDashboardData";
import type { Entity, RecordData } from "../types/entities";

type Props = { userName: string; onLogout: () => void };

export default function DashboardPage({ userName, onLogout }: Props) {
  const [entity, setEntity] = useState<Entity>("continentes");
  const [editing, setEditing] = useState<RecordData | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const data = useDashboardData(entity);
  const mapRecord =
    entity === "cidades" ? data.records.find((item) => item.latitude && item.longitude) : undefined;

  function openForm(record: RecordData | null = null) {
    setEditing(record);
    setFormOpen(true);
  }

  function closeForm() {
    setEditing(null);
    setFormOpen(false);
  }

  function saved() {
    closeForm();
    data.refresh().catch(() => undefined);
  }

  return (
    <DashboardLayout
      entity={entity}
      userName={userName}
      onEntityChange={setEntity}
      onLogout={onLogout}
    >
      <PageHeader entity={entity} onAdd={() => openForm()} />
      <StatsGrid total={data.total} page={data.page} />
      <DataPanel
        entity={entity}
        records={data.records}
        continents={data.continents}
        countries={data.countries}
        search={data.search}
        relation={data.relation}
        page={data.page}
        pages={data.pages}
        total={data.total}
        loading={data.loading}
        error={data.error}
        onSearchChange={(value) => {
          data.setSearch(value);
          data.setPage(1);
        }}
        onRelationChange={(value) => {
          data.setRelation(value);
          data.setPage(1);
        }}
        onPageChange={data.setPage}
        onEdit={openForm}
        onRemove={data.remove}
      />
      {mapRecord && <MapCard record={mapRecord} />}
      {formOpen && (
        <EntityForm
          entity={entity}
          editing={editing}
          continents={data.continents}
          countries={data.countries}
          onClose={closeForm}
          onSaved={saved}
        />
      )}
    </DashboardLayout>
  );
}
