"use client";

import { FormEvent, useMemo, useState } from "react";
import { ApiRequestError, getApiConfig, loginUser, registerUser } from "@/lib/api";

type AuthMode = "login" | "register";

type FormState = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

const INITIAL_FORM_STATE: FormState = {
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: ""
};

function getMessageFromError(error: unknown): string {
  if (error instanceof ApiRequestError) return error.message;
  if (error instanceof Error) return error.message;
  return "Falha inesperada na requisicao.";
}

export default function AccountPage() {
  const apiConfig = getApiConfig();
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitLabel = useMemo(() => (mode === "login" ? "Entrar" : "Criar conta"), [mode]);

  function resetFeedback() {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetFeedback();

    const email = form.email.trim();
    const senha = form.senha.trim();
    const nome = form.nome.trim();

    if (!email || !senha) {
      setErrorMessage("Preencha email e senha.");
      return;
    }

    if (mode === "register") {
      if (!nome) {
        setErrorMessage("Informe seu nome.");
        return;
      }
      if (form.senha !== form.confirmarSenha) {
        setErrorMessage("As senhas nao conferem.");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === "register") {
        const response = await registerUser({ nome, email, senha });
        setSuccessMessage(response.mensagem ?? "Conta criada com sucesso.");
        setForm(INITIAL_FORM_STATE);
        setMode("login");
      } else {
        const response = await loginUser({ email, senha });
        if (response.token) {
          window.localStorage.setItem("ecommerce_token", response.token);
        }
        setSuccessMessage(response.mensagem ?? "Login realizado com sucesso.");
      }
    } catch (error) {
      setErrorMessage(getMessageFromError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="stack-lg">
      <div className="hero compact">
        <p className="eyebrow">Conta</p>
        <h1>Autenticacao integrada ao backend</h1>
        <p>
          Cadastro usa <code>POST {apiConfig.registerPath}</code>. Login usa{" "}
          <code>POST {apiConfig.loginPath}</code>.
        </p>
      </div>

      <div className="auth-card">
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            className={`tab-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              resetFeedback();
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => {
              setMode("register");
              resetFeedback();
            }}
          >
            Cadastro
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label>
              Nome
              <input
                value={form.nome}
                onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="voce@email.com"
              autoComplete="email"
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={form.senha}
              onChange={(event) => setForm((current) => ({ ...current, senha: event.target.value }))}
              placeholder="Sua senha"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {mode === "register" ? (
            <label>
              Confirmar senha
              <input
                type="password"
                value={form.confirmarSenha}
                onChange={(event) =>
                  setForm((current) => ({ ...current, confirmarSenha: event.target.value }))
                }
                placeholder="Repita a senha"
                autoComplete="new-password"
              />
            </label>
          ) : null}

          {errorMessage ? <div className="callout error">{errorMessage}</div> : null}
          {successMessage ? <div className="callout success">{successMessage}</div> : null}

          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
