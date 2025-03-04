import React from "react";

export default function ActivitiesForm({ user_id }: { user_id: string }) {
  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="card form-background w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Formulário
        </h1>

        {/* Exemplo de campo de formulário */}
        <div className="space-y-4">
          <div>
            <div className="text-sm text-[var(--dark-muted-color)] mb-2">
              {user_id}
            </div>
            <label className="block text-[var(--dark-muted-color)] mb-2">
              Campo de exemplo
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Digite aqui"
            />
          </div>

          <button className="button-primary w-full text-[var(--foreground-color)]">
            Enviar
          </button>
          <a href="/api/auth/logout" className="text-[var(--dark-muted-color)]">
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}
