import { type FormEvent, useState } from "react";
import { api } from "../../Services/apiService";
import styles from "./AuthForm.module.css";

type Props = {
  mode: "login" | "register";
  onAuthenticated: (userName: string) => void;
};

export default function AuthForm({ mode, onAuthenticated }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api<{ token: string; user: { nome: string } }>(
        `/auth/${mode === "login" ? "login" : "register"}`,
        { method: "POST", body: JSON.stringify({ nome, email, senha }) },
      );
      localStorage.setItem("atlas_token", result.token);
      localStorage.setItem("atlas_user", result.user.nome);
      onAuthenticated(result.user.nome);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      {mode === "register" && (
        <label>
          Nome
          <input value={nome} onChange={(event) => setNome(event.target.value)} required />
        </label>
      )}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label>
        Senha
        <input
          type="password"
          minLength={6}
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          required
        />
      </label>
      {error && <p className="formError">{error}</p>}
      <button className="primaryButton" disabled={loading}>
        {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
      </button>
    </form>
  );
}
