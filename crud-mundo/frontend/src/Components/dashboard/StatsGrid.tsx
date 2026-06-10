import styles from "./StatsGrid.module.css";

export default function StatsGrid({ total, page }: { total: number; page: number }) {
  return (
    <section className={styles.grid}>
      <article>
        <span>Total cadastrado</span>
        <strong>{String(total).padStart(2, "0")}</strong>
      </article>
      <article>
        <span>Página atual</span>
        <strong>{String(page).padStart(2, "0")}</strong>
      </article>
      <article>
        <span>Integrações</span>
        <strong>02</strong>
      </article>
    </section>
  );
}
