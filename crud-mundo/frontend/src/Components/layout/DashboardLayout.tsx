import type { ReactNode } from "react";
import { entityLabels } from "../../constants/entities";
import type { Entity } from "../../types/entities";
import Sidebar from "./Sidebar";
import styles from "./DashboardLayout.module.css";

type Props = {
  children: ReactNode;
  entity: Entity;
  userName: string;
  onEntityChange: (entity: Entity) => void;
  onLogout: () => void;
};

export default function DashboardLayout(props: Props) {
  return (
    <div className={styles.shell}>
      <Sidebar
        entity={props.entity}
        userName={props.userName}
        onEntityChange={props.onEntityChange}
        onLogout={props.onLogout}
      />
      <main className={styles.content}>
        <header className={styles.topbar}>
          <span className="eyebrow">
            BASE GEOGRÁFICA / {entityLabels[props.entity].toUpperCase()}
          </span>
          <span>
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </header>
        {props.children}
      </main>
    </div>
  );
}
