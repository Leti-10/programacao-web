import { entityLabels, entitySubtitles } from "../../constants/entities";
import type { Entity } from "../../types/entities";
import styles from "./PageHeader.module.css";

export default function PageHeader({ entity, onAdd }: { entity: Entity; onAdd: () => void }) {
  return (
    <section className={styles.header}>
      <div>
        <h1>{entityLabels[entity]}</h1>
        <p>{entitySubtitles[entity]}</p>
      </div>
      <button className="primaryButton" onClick={onAdd}>
        + Novo registro
      </button>
    </section>
  );
}
