import { useActivitiesForm, DIFFICULTY_OPTIONS } from "./useActivitiesForm";
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import { FaUserCircle, FaCheckCircle } from "react-icons/fa";

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
        router.push("/api/auth/login");
      }
    } catch (error) {
      console.error("Erro ao verificar CPF/CNPJ:", error);
      setCpfCnpjError("Erro ao verificar CPF/CNPJ. Tente novamente.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-accent-color">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mx-auto my-6 
          sm:p-4 sm:max-w-[1800px] sm:min-h-[600px] 
          md:p-8 md:min-h-[900px] md:min-w-[800px]"
      >
        {formStep === "UPLOAD_FILES" && (
          <>
            <div className="flex justify-center  mt-6 mb-12 mr-12 ml-12 text-primary-color">
              Realize Atividades
            </div>
            <h1 className="text-title-color">Boas vindas!</h1>
            <p className="text-center mb-6 text-muted-color">
              Este é o{" "}
              <strong className="text-primary-color">Realize Atividades</strong>
              , nossa nova ferramenta de Inteligência Artificial que gera
              atividades interativas de acordo com as competências do seu
              material didático.
            </p>
            <div className="mb-4">
              <label
                htmlFor="files"
                className="block text-center cursor-pointer border-dashed border-2 border-gray-300 p-6 rounded-lg"
              >
                <span className="block mb-2 text-center text-primary-color">
                  <FaUserCircle className="inline-block text-4xl text-accent-color" />
                  <br />
                  Arraste e solte arquivos aqui ou{" "}
                  <span
                    style={{ color: "var(--accent-color)" }}
                    className="underline"
                  >
                    escolha o arquivo
                  </span>
                </span>
                <span className="text-muted-color">
                  Tipo de arquivo suportado: .pdf
                </span>
              </label>
              <input
                type="file"
                id="files"
                accept=".pdf"
                onChange={onFileChange}
                multiple
                className="hidden"
              />
            </div>
            {!isLoggedIn && (
              <div className="text-center flex flex-col items-center w-full">
                <p>
                  <Link
                    href="/api/auth/login"
                    className="text-primary-color w-full block mb-2"
                  >
                    Cadastre-se
                  </Link>{" "}
                  para poder baixar arquivos
                </p>
                <p>
                  Já possui cadastro?{" "}
                  <Link
                    href="/api/auth/login"
                    className="text-primary-color w-full block"
                  >
                    Faça login
                  </Link>
                </p>
              </div>
            )}
          </>
        )}

        {formStep === "UPLOADED" && (
          <>
            <h1 className="text-title-color">Envio de arquivos</h1>
            <div className="bg-green-50 p-6 rounded-lg text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 border-2 border-purple-300 mb-3">
                <FaCheckCircle className="text-4xl text-emerald-400" />
              </div>
              <p className="text-emerald-700 font-medium">
                Envio de arquivos concluído!
              </p>
            </div>
            <p className="text-primary-color font-medium mb-4 text-center text-2xl">
              Lista de arquivos enviados
            </p>
            {formData.files.length > 0 && (
              <ul>
                {formData.files.map((file) => (
                  <li
                    className="flex justify-between items-center mb-4 p-4 border-2 border-gray-300 rounded-lg"
                    key={file.name}
                  >
                    <span>
                      {file.name} ({file.size})
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.name)}
                      className="button-secondary-color"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2 flex justify-center">
              <div className="flex gap-2 w-full justify-center items-center flex-col">
                <button
                  type="button"
                  onClick={() => setFormStep("UPLOAD_FILES")}
                  className="button-secondary-color w-full "
                >
                  Enviar mais arquivos
                </button>
                <button
                  type="button"
                  onClick={() => setFormStep("OPTIONS")}
                  className="button-primary-color w-full"
                >
                  Continuar
                </button>
              </div>
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
              <Link
                href="https://sandbox.asaas.com/c/ro4fw90olj1m5o31"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fazer Assinatura
              </Link>
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
