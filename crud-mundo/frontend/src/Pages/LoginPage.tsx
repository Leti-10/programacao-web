import { useState } from "react";
import AuthForm from "../Components/auth/AuthForm";
import styles from "../Styles/pages/LoginPage.module.css";

type Props = { onAuthenticated: (userName: string) => void };

export default function LoginPage({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className={styles.page}>
      <section className={styles.presentation}>
        <span className="eyebrow">ATLAS / 01</span>
        <h1>
          O mundo,
          <br />
          organizado.
        </h1>
        <p>Cadastre continentes, países e cidades em uma base geográfica simples e conectada.</p>
        <div className={styles.coordinates}>23.2237 S&nbsp;&nbsp;45.9009 W</div>
      </section>
      <section className={styles.panel}>
        <div className="brand">
          <span className="brandMark">A</span> ATLAS
        </div>
        <div>
          <p className="eyebrow">{mode === "login" ? "Bem-vindo de volta" : "Novo acesso"}</p>
          <h2>{mode === "login" ? "Entre na sua conta" : "Crie sua conta"}</h2>
        </div>
        <AuthForm mode={mode} onAuthenticated={onAuthenticated} />
        <button
          className="textButton"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Ainda não tenho uma conta" : "Já tenho uma conta"}
        </button>
      </section>
    </main>
  );
}
