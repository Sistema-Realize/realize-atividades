import { useActivitiesForm, DIFFICULTY_OPTIONS } from "./useActivitiesForm";
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";

type ActivitiesFormProps = {
  onSubmit: (formData: globalThis.FormData) => Promise<void>;
};

export default function ActivitiesForm(props: ActivitiesFormProps) {
  const { isLoggedIn, fullName, cpfCnpj, setFullName, setCpfCnpj } =
    useUserContext();
  const router = useRouter();

  const [cpfCnpjError, setCpfCnpjError] = useState<string | null>(null);

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

  const handleRegisterClick = async () => {
    if (!cpfCnpj) return;

    try {
      const response = await axios.post("/api/asaas/checkUserAccount", {
        cpfCnpj,
      });

      if (response.data.exists) {
        setCpfCnpjError("CPF/CNPJ já tem uma conta existente no sistema.");
      } else {
        setCpfCnpjError("");
        // Redirect to login route
        router.push("/api/auth/login");
      }
    } catch (error) {
      console.error("Erro ao verificar CPF/CNPJ:", error);
      setCpfCnpjError("Erro ao verificar CPF/CNPJ. Tente novamente.");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        {formStep === "UPLOAD_FILES" && (
          <>
            <h1>Boas vindas!</h1>
            <p>
              Este é o <strong>Realize Atividades</strong>, nossa nova
              ferramenta de Inteligência Artificial que gera atividades
              interativas de acordo com as competências do seu material
              didático.
            </p>
            <div>
              <label htmlFor="files">
                Arraste e solte arquivos aqui ou <span>escolha o arquivo</span>
                <br />
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
                <p>
                  <Link href="/api/auth/login">Cadastre-se</Link> para poder
                  baixar arquivos
                </p>
                <p>
                  Já possui cadastro?{" "}
                  <Link href="/api/auth/login">Faça login</Link>
                </p>
              </div>
            )}
          </>
        )}

        {formStep === "UPLOADED" && (
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
              <button type="button" onClick={() => setFormStep("UPLOAD_FILES")}>
                Enviar mais arquivos
              </button>
              <button type="button" onClick={() => setFormStep("OPTIONS")}>
                Continuar
              </button>
            </div>
          </>
        )}

        {formStep === "OPTIONS" && (
          <>
            <h1>Opções das atividades</h1>
            <p>Selecione as opções desejadas</p>
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
            {errorMessage && (
              <div>
                <span>{errorMessage}</span>
              </div>
            )}
            <div>
              <button disabled={!isFormValid || isSubmitting} type="submit">
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
              <button type="button" onClick={() => setFormStep("UPLOAD_FILES")}>
                Voltar
              </button>
            </div>
          </>
        )}

        {formStep === "LOGIN" && (
          <>
            <h1>Quase lá!</h1>
            <p>
              Falta muito pouco para você gerar suas atividades! Basta acessar a
              sua conta ou criar um novo cadastro e fazer o pagamento.
            </p>

            <div>
              <div>
                <label>
                  Nome completo
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Digite seu nome completo"
                    // Store the input value in context
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  CPF/CNPJ
                  <input
                    type="text"
                    name="cpfCnpj"
                    placeholder="Digite seu CPF/CNPJ"
                    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}"
                    title="Digite um CPF/CNPJ no formato: xxx.xxx.xxx-xx ou xx.xxx.xxx/xxxx-xx"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    required
                  />
                </label>
                {cpfCnpjError && <span>{cpfCnpjError}</span>}
              </div>
              <div>
                <button onClick={handleRegisterClick}>
                  Quero me cadastrar
                </button>
              </div>
            </div>
            <div>
              <Link href="/api/auth/login">
                Já tenho uma conta. Fazer Login
              </Link>
            </div>
          </>
        )}

        {formStep === "SUBSCRIPTION" && (
          <>
            <h1>Assinatura</h1>
            <p>
              Contas de teste não possuem acesso a geração de mais de 1
              atividade.
            </p>
            <p>Faça a assinatura para poder gerar suas atividades</p>
            <div>
              <button>Fazer Assinatura</button>
              <button type="button" onClick={() => setFormStep("OPTIONS")}>
                Voltar
              </button>
            </div>
          </>
        )}

        {formStep === "SUCCESS" && (
          <>
            <h1>Atividades solicitadas</h1>
            <p>Suas atividades estão sendo geradas!</p>
            <p>Isso pode demorar alguns minutos.</p>
            <p>
              Veja seu histórico de atividades clicando{" "}
              <Link href="/">aqui</Link>.
            </p>
            <div>
              <button type="button" onClick={() => setFormStep("UPLOAD_FILES")}>
                Gerar novas atividades
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
