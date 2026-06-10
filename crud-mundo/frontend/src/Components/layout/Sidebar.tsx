import { entityLabels } from "../../constants/entities";
import type { Entity } from "../../types/entities";
import styles from "./Sidebar.module.css";

type Props = {
  entity: Entity;
  userName: string;
  onEntityChange: (entity: Entity) => void;
  onLogout: () => void;
};

export default function Sidebar({ entity, userName, onEntityChange, onLogout }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className="brand">
        <span className="brandMark">A</span> ATLAS
      </div>
      <nav className={styles.navigation}>
        {(Object.keys(entityLabels) as Entity[]).map((item, index) => (
          <button
            key={item}
            className={entity === item ? styles.active : ""}
            onClick={() => onEntityChange(item)}
          >
            <span>0{index + 1}</span>
            {entityLabels[item]}
          </button>
        ))}
      </nav>
      <div className={styles.footer}>
        <div className={styles.avatar}>{userName.slice(0, 1).toUpperCase()}</div>
        <div>
          <strong>{userName}</strong>
          <span>Administrador</span>
        </div>
        <button className={styles.logout} onClick={onLogout} title="Sair">
          ↗
        </button>
      </div>
    </aside>
  );
}
