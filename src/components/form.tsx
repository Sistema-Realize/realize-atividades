import React from "react";

export default function Form() {
  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="card form-background w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-[var(--foreground)]">
          Formulário
        </h1>

        {/* Exemplo de campo de formulário */}
        <div className="space-y-4">
          <div>
            <label className="block text-[var(--dark-muted-color)] mb-2">
              Campo de exemplo
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Digite aqui"
            />
          </div>

          <button className="button-primary w-full">Enviar</button>
        </div>
      </div>
    </div>
  );
}
