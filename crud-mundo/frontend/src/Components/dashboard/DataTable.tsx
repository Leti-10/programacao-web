import { entityColumns } from "../../constants/entities";
import type { Entity, RecordData } from "../../types/entities";
import styles from "./DataTable.module.css";

type Props = {
  entity: Entity;
  records: RecordData[];
  loading: boolean;
  onEdit: (record: RecordData) => void;
  onRemove: (record: RecordData) => void;
};

export default function DataTable({ entity, records, loading, onEdit, onRemove }: Props) {
  const columns = entityColumns[entity];

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column.replaceAll("_", " ")}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            records.map((record) => (
              <tr key={record.id}>
                {columns.map((column) => (
                  <td key={column}>
                    {column === "bandeira" && record[column] ? (
                      <img className={styles.flag} src={String(record[column])} alt="" />
                    ) : column === "populacao" && record[column] !== null ? (
                      Number(record[column]).toLocaleString("pt-BR")
                    ) : (
                      String(record[column] ?? "—")
                    )}
                  </td>
                ))}
                <td className={styles.actions}>
                  <button onClick={() => onEdit(record)}>Editar</button>
                  <button onClick={() => onRemove(record)}>Excluir</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {loading && <div className={styles.empty}>Carregando registros...</div>}
      {!loading && !records.length && (
        <div className={styles.empty}>Nenhum registro encontrado.</div>
      )}
    </div>
  );
}
