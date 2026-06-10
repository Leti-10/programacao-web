import type { RecordData } from "../../types/entities";
import styles from "./MapCard.module.css";

export default function MapCard({ record }: { record: RecordData }) {
  const latitude = Number(record.latitude);
  const longitude = Number(record.longitude);
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.08}%2C${latitude - 0.05}%2C${longitude + 0.08}%2C${latitude + 0.05}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <section className={styles.card}>
      <div>
        <span className="eyebrow">OPENSTREETMAP</span>
        <h2>{record.nome}</h2>
        <p>
          {record.pais_nome} · {record.latitude}, {record.longitude}
        </p>
      </div>
      <iframe title={`Mapa de ${record.nome}`} src={mapUrl} />
    </section>
  );
}
