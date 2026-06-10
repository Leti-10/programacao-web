import type { Entity, Option, RecordData } from "../../types/entities";
import DataTable from "./DataTable";
import styles from "./DataPanel.module.css";

type Props = {
  entity: Entity;
  records: RecordData[];
  continents: Option[];
  countries: Option[];
  search: string;
  relation: string;
  page: number;
  pages: number;
  total: number;
  loading: boolean;
  error: string;
  onSearchChange: (value: string) => void;
  onRelationChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (record: RecordData) => void;
  onRemove: (record: RecordData) => void;
};

export default function DataPanel(props: Props) {
  const options =
    props.entity === "paises" ? props.continents : [...props.countries, ...props.continents];

  return (
    <section className={styles.panel}>
      <div className={styles.toolbar}>
        <input
          placeholder="Buscar registros..."
          value={props.search}
          onChange={(event) => props.onSearchChange(event.target.value)}
        />
        {props.entity !== "continentes" && (
          <select
            value={props.relation}
            onChange={(event) => props.onRelationChange(event.target.value)}
          >
            <option value="">Todos os relacionamentos</option>
            {options.map((item, index) => (
              <option key={`${item.id}-${index}`} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        )}
      </div>
      {props.error && <p className={styles.error}>{props.error}</p>}
      <DataTable
        entity={props.entity}
        records={props.records}
        loading={props.loading}
        onEdit={props.onEdit}
        onRemove={props.onRemove}
      />
      <footer className={styles.pagination}>
        <span>{props.total} registro(s)</span>
        <div>
          <button disabled={props.page === 1} onClick={() => props.onPageChange(props.page - 1)}>
            Anterior
          </button>
          <span>
            {props.page} / {props.pages}
          </span>
          <button
            disabled={props.page === props.pages}
            onClick={() => props.onPageChange(props.page + 1)}
          >
            Próxima
          </button>
        </div>
      </footer>
    </section>
  );
}
