import { useActivitiesForm, DIFFICULTY_OPTIONS } from "./useActivitiesForm";
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";
import { FaUserCircle, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

type ActivitiesFormProps = {
  onSubmit: (formData: globalThis.FormData) => Promise<void>;
};

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
    createPayment,
  } = useActivitiesForm(props);

  return (
    <div className="formDesktop formMobile flex flex-col justify-start  items-center">
      <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
        {/* Logo added at the top of all form steps */}
        <div className="mb-10 mt-10">
          <Image
            src="/realizeAtividadelogo.png"
            alt="Realize Atividade Logo"
            width={200}
            height={80}
            priority
          />
        </div>

        {formStep === "UPLOAD_FILES" && (
          <div className="w-full flex flex-col items-center">
            <h1 className="welcome-title">Boas vindas!</h1>
            <p className="text-primary-color mb-10 text-center max-w-2xl mx-auto">
              Este é o{" "}
              <strong className="text-primary-color font-bold">
                Realize Atividades
              </strong>
              , nossa nova ferramenta de Inteligência Artificial que gera
              atividades interativas de acordo com as competências do seu
              material didático.
            </p>
            <div className="my-3 w-full max-w-1000 flex flex-col items-center justify-center">
              <label
                htmlFor="files"
                className=" text-center cursor-pointer pb-10 py-20 pl-20 pr-20 rounded-lg bg-gray-100 flex flex-col items-center justify-center"
              >
                <Image
                  className="mb-8"
                  src="/CloudArrowUp.svg"
                  alt="Upload Icon"
                  width={70}
                  height={70}
                />
                <span className="block mb-8 text-center text-primary-color font-bold mt-2">
                  Arraste e solte arquivos aqui ou{" "}
                  <span
                    style={{ color: "var(--accent-color)" }}
                    className="underline cursor-pointer text-muted-color"
                  >
                    escolha o arquivo
                  </span>
                </span>
                <span className="text-muted-color mt-20  ">
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
              <div className="text-center text-muted-color flex flex-col items-center w-full mb-10">
                <div>
                  <Link
                    href="/api/auth/login"
                    className="text-red-500 font-bold"
                  >
                    <div className="flex items-center mb-4 mt-5">
                      <span className="underline mr-2">Cadastre-se</span>
                      <p className="text-muted-color font-normal">
                        para poder baixar arquivos
                      </p>
                    </div>
                  </Link>
                </div>
                <div>
                  <p className="text-muted-color ">
                    Já possui cadastro?{" "}
                    <Link
                      href="/api/auth/login"
                      className="text-red-500 font-bold underline"
                    >
                      Faça login
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {formStep === "UPLOADED" && (
          <div className="flex flex-col items-center formDesktop formMobile">
            <h1 className="welcome-title font-bold text-6xl">
              Envio de <span className="block sm:inline">arquivos</span>
            </h1>
            <div className="bg-green-50 p-20 w-150 rounded-lg text-center mb-10">
              <div className="inline-flex items-center justify-center rounded-full border-2 mb-4">
                <Image
                  src="/checkcircle.svg"
                  alt="Check"
                  width={200}
                  height={200}
                  className="w-10 h-10"
                />
              </div>
              <p className="text-emerald-700 font-medium">
                Envio de arquivos concluído!
              </p>
            </div>
            <div className="text-left">
              <p
                className="text-primary-color font-medium mb-6 text-3xl"
                style={{ fontFamily: "P22 Mackinac Pro" }}
              >
                Lista de arquivos enviados
              </p>
              {formData.files.length > 0 && (
                <ul className="mb-8 w-150 space-y-4">
                  {formData.files.map((file) => (
                    <li
                      className="text-primary-color flex justify-between items-center p-4 border-2 border-gray-300 rounded-lg"
                      key={file.name}
                    >
                      <span className="text-primary-color font-medium">
                        {file.name} ({file.size})
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(file.name)}
                        className="button-secondary-color ml-auto"
                      >
                        <Image
                          src="/Trashicon.svg"
                          alt="Trash Icon"
                          width={20}
                          height={20}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-1 justify-center items-center mt-10">
              <button
                type="button"
                onClick={() => setFormStep("UPLOAD_FILES")}
                className="button-secondary-color w-full  mobile-full-width-btn"
              >
                Enviar mais arquivos
              </button>
              <button
                type="button"
                onClick={() => setFormStep("OPTIONS")}
                className="button-primary-color w-150 mobile-full-width-btn"
              >
                Continuar
              </button>
              <div className="text-center text-muted-color flex flex-col items-center w-full mb-10">
                <div>
                  <Link
                    href="/api/auth/login"
                    className="text-red-500 font-bold"
                  >
                    <div className="flex items-center mb-4 mt-5">
                      <span className="underline mr-2">Cadastre-se</span>
                      <p className="text-muted-color font-normal">
                        para poder baixar arquivos
                      </p>
                    </div>
                  </Link>
                </div>
                <div>
                  <p className="text-muted-color ">
                    Já possui cadastro?{" "}
                    <Link
                      href="/api/auth/login"
                      className="text-red-500 font-bold underline"
                    >
                      Faça login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {formStep === "OPTIONS" && (
          <div className="formDesktop formMobile text-primary-color flex flex-col items-center">
            <h1 className="welcome-title font-bold">
              Opções das
              <br />
              Atividades
            </h1>

            <div className="w-150 mb-6">
              <label htmlFor="amount" className="block font-medium mb-2">
                QUANTIDADE DE ATIVIDADES *
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={onAmountChange}
                min="1"
                max="50"
                className="w-150 p-3 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-muted-color mt-1">
                Escolha um número de 1 a 50
              </p>
            </div>

            <div className="w-150 mb-6">
              <label className="block font-medium mb-2">
                NÍVEL DE DIFICULDADE *
              </label>
              <div className="space-y-2">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`difficulty-${option}`}
                      checked={formData.difficulty.includes(option)}
                      onChange={() => onDifficultyChange(option)}
                      className="mr-2 h-4 w-4"
                    />
                    <label
                      htmlFor={`difficulty-${option}`}
                      className="cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-color mt-1">
                Selecione pelo menos uma opção
              </p>
            </div>

            {errorMessage && (
              <div className="w-full mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="w-full space-y-2 mt-4 flex flex-col items-center">
              <button
                disabled={!isFormValid || isSubmitting}
                type="submit"
                className="button-primary-color w-150 mobile-full-width-btn"
              >
                {isSubmitting ? "Enviando..." : "Gerar atividades"}
              </button>
              <button
                type="button"
                onClick={() => setFormStep("UPLOAD_FILES")}
                className="button-secondary-color w-150 mobile-full-width-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
            </div>
          </div>
        )}

        {formStep === "LOGIN" && (
          <>
            <h1 className="text-title-color">Quase lá!</h1>
            <p className="text-center mb-6 text-muted-color">
              Falta muito pouco para você gerar suas atividades! Basta acessar a
              sua conta ou criar um novo cadastro e fazer o pagamento.
            </p>

            <div className="flex flex-col space-y-4 w-full items-center">
              <div className="w-full flex justify-center">
                <Link
                  href="/api/auth/login"
                  className="button-primary-color w-150 py-3 rounded-md text-center"
                >
                  Quero me cadastrar
                </Link>
              </div>
              <div className="w-full flex justify-center">
                <Link
                  href="/api/auth/login"
                  className="button-secondary-color w-150 py-3 rounded-md inline-block text-center"
                >
                  Já tenho uma conta. Fazer Login
                </Link>
              </div>
            </div>
          </>
        )}

        {formStep === "SUBSCRIPTION" && (
          <div className="formDesktop formMobile text-primary-color flex flex-col items-center">
            <h1 className="text-title-color">Quase lá!</h1>
            <p className="text-center mb-4 text-muted-color">
              Falta muito pouco para você gerar suas atividades! Basta acessar a
              sua conta ou criar um novo cadastro e fazer o pagamento.
            </p>

            <div className="flex flex-col items-center space-y-4 mt-6">
              <button
                type="button"
                onClick={createPayment}
                className="button-primary-color w-150 text-center py-4"
              >
                Fazer assinatura
              </button>
              <button
                type="button"
                onClick={() => setFormStep("OPTIONS")}
                className="button-secondary-color w-150 text-center py-4"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {formStep === "SUCCESS" && (
          <>
            <h1 className="text-title-color text-center text-2xl font-bold mb-4">
              Suas atividades estão sendo geradas!
            </h1>
            <p className="text-center text-muted-color mb-2">
              Aguarde um instante, a geração pode demorar alguns minutos.
              Enquanto isso, você pode conferir seu{" "}
              <Link href="/history">histórico de atividades</Link>.
            </p>

            <div className="flex flex-col items-center space-y-4 mt-8">
              <button
                type="button"
                onClick={() => setFormStep("UPLOAD_FILES")}
                className="button-primary-color py-3 rounded-md text-center"
              >
                Gerar novas atividades
              </button>

              <Link
                href="/history"
                className="button-secondary-color py-3 rounded-md text-center"
              >
                Histórico de atividades
              </Link>
            </div>
          </>
        )}
      </form>

      {/* Rodapé condicionado ao login do usuário */}
      {isLoggedIn && (
        <div className="mt-12 pt-4 border-t border-gray-200">
          <div className="flex flex-col space-y-2 text-sm text-muted-color">
            <Link href="/userProfile" className="flex items-center">
              <FaUserCircle className="mr-2" /> Minha conta
            </Link>
            <Link href="/history" className="flex items-center">
              <FaCheckCircle className="mr-2" /> Gerenciar atividades
            </Link>
            <Link href="/api/auth/logout" className="flex items-center">
              <span className="mr-2">↪</span> Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
