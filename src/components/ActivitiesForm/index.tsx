import React from 'react';
import { useActivitiesForm, DIFFICULTY_OPTIONS } from './useActivitiesForm';
import Link from 'next/link';
import { useUserContext } from '@/contexts/UserContext';

type ActivitiesFormProps = {
  onSubmit: (formData: globalThis.FormData) => Promise<void>;
}

export default function ActivitiesForm(props: ActivitiesFormProps) {
  const { isLoggedIn } = useUserContext();
  const {
    formStep,
    setFormStep,
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
      <form onSubmit={onSubmit}>
        {formStep === 'UPLOAD_FILES' && (
          <>
            <h1>Boas vindas!</h1>
            <p>Este é o <strong>Realize Atividades</strong>, nossa nova ferramenta de Inteligência Artificial que gera atividades interativas de acordo com as competências do seu material didático.</p>
            <div>
              <label htmlFor="files">
                Arraste e solte arquivos aqui ou <span>escolha o arquivo</span><br />
                <span>Tipo de arquivo suportado: .pdf</span>
              </label>
              <input
                type="file"
                id="files"
                accept=".pdf"
                onChange={onFileChange}
                multiple
              />
            </div>
            {!isLoggedIn && (
              <div>
                <p><Link href="/api/auth/login">Cadastre-se</Link> para poder baixar arquivos</p>
                <p>Já possui cadastro? <Link href="/api/auth/login">Faça login</Link></p>
              </div>
            )}
          </>
        )}

        {formStep === 'UPLOADED' && (
          <>
            <h1>Envio de arquivos</h1>
            <p>Envio de arquivos concluído!</p>
            <div>
              <p>Lista de arquivos enviados</p>
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
              <button
                type="button"
                onClick={() => setFormStep('UPLOAD_FILES')}
              >
                Enviar mais arquivos
              </button>
              <button
                type="button"
                onClick={() => setFormStep('OPTIONS')}
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {formStep === 'OPTIONS' && (
          <>
            <h1>Opções das atividades</h1>
            <p>Selecione as opções desejadas</p>
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
            {errorMessage && (
              <div>
                <span>{errorMessage}</span>
              </div>
            )}
            <div>
              <button
                disabled={!isFormValid || isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
              <button
                type="button"
                onClick={() => setFormStep('UPLOAD_FILES')}
              >
                Voltar
              </button>
            </div>
          </>
        )}

        {formStep === 'SUCCESS' && (
          <>
            <h1>Atividades solicitadas</h1>
            <p>Suas atividades estão sendo geradas!</p>
            <p>Isso pode demorar alguns minutos.</p>
            <p>Veja seu histórico de atividades clicando <Link href="/">aqui</Link>.</p>
            <div>
              <button
                type="button"
                onClick={() => setFormStep('UPLOAD_FILES')}
              >
                Gerar novas atividades
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
} 