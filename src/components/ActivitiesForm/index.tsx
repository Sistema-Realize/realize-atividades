import React from 'react';
import { useActivitiesForm, DIFFICULTY_OPTIONS } from './useActivitiesForm';

type ActivitiesFormProps = {
  onSubmit: (formData: globalThis.FormData) => Promise<void>;
}

export default function ActivitiesForm(props: ActivitiesFormProps) {
  const {
    formData,
    isFormValid,
    onFileChange,
    onAmountChange,
    onDifficultyChange,
    onRemoveFile,
    onSubmit,
    isSubmitting,
    errorMessage,
  } = useActivitiesForm(props);

  return (
    <div>
      <h1>Formulário</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="files">
            Arquivos
          </label>
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
                  <span>
                    {file.name} ({file.size})
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(file.name)}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="amount">
            Quantidade de atividades
          </label>
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
          <label>
            Nível de dificuldade
          </label>
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
        <button
          disabled={!isFormValid || isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
        {errorMessage && (
          <div>
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
} 