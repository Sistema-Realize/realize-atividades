import React from 'react';
import { useActivitiesForm } from './useActivitiesForm';

const DIFFICULTY_OPTIONS = ['Fácil', 'Médio', 'Difícil'];

export default function ActivitiesForm() {
  const {
    formData,
    isFormValid,
    onFileChange,
    onAmountChange,
    onDifficultyChange,
    removeFile,
    onSubmit,
  } = useActivitiesForm();

  return (
    <div>
      <h1>Formulário</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="files">Arquivos</label>
          <input
            type="file"
            id="files"
            accept=".pdf"
            onChange={onFileChange}
            multiple
          />
          {formData.files.length > 0 && (
            <ul>
              {formData.files.map((file) => (
                <li key={file.name}>
                  <span>{file.name} ({file.size})</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="amount">Quantidade de atividades</label>
          <input
            type="number"
            id="amount"
            value={formData.amount}
            onChange={onAmountChange}
            min="1"
            max="50"
          />
        </div>

        <div>
          <label>Nível de dificuldade</label>
          <div>
            {DIFFICULTY_OPTIONS.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={formData.difficulty.includes(option)}
                  onChange={() => onDifficultyChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button disabled={!isFormValid} type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
} 