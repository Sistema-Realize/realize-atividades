import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { FaFileUpload, FaRegFilePdf } from "react-icons/fa";

export default function Form() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Captura o arquivo PDF escolhido
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  // Simula o envio do arquivo e busca dados fictícios
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      setMessage("Por favor, selecione um arquivo.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Simula a requisição para envio do arquivo
      const response = await fetch("/api/fakeData");
      const result = await response.json();

      if (response.ok) {
        setMessage("Dados carregados com sucesso!");
        console.log("Resposta da API:", result);
        router.push("/result");
      } else {
        setMessage(`Erro: ${result.message || "Falha ao carregar os dados"}`);
      }
    } catch (error) {
      setMessage("Erro ao buscar os dados.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dispara a seleção do arquivo manualmente
  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="form-background p-6 w-full max-w-md">
        <FaRegFilePdf className="mx-auto mb-4 w-36 h-36 text-primary-color" />
        <h1 className="text-3xl font-bold text-primary-color text-center mb-4">
          Enviar Arquivo PDF
        </h1>
        <p className="text-gray-700 text-center mb-6 leading-relaxed">
          Faça o upload de um arquivo PDF e receba informações simuladas.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center border border-gray-300">
            <FaFileUpload className="mb-4 w-12 h-12 text-gray-600" />
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              multiple={false}
              className="hidden"
              ref={fileInputRef}
            />
            <p className="text-gray-600 font-semibold">
              Arraste e solte um arquivo aqui ou{" "}
              <span
                className="text-red-500 font-bold underline cursor-pointer"
                onClick={handleChooseFiles}
              >
                clique para selecionar
              </span>
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Tipo de arquivo suportado: <strong>.pdf</strong>
            </p>
          </div>
          {files.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Arquivo Selecionado:</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          {message && (
            <p className="text-sm text-center text-gray-700 bg-gray-100 p-2 rounded">
              {message}
            </p>
          )}
          <button
            type="submit"
            className="button-primary w-full"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}
