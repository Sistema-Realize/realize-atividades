import { useState, useRef } from "react";
import { FaFileUpload, FaRegFilePdf } from "react-icons/fa";
import { useRouter } from "next/router";

export default function Form() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length > 0) {
      // Simule o envio dos arquivos
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: files.map((file) => ({ name: file.name })),
        }),
      });

      const result = await response.json();
      console.log(result);

      // Redirecionar para a página de resultados após o envio
      router.push("/result");
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="form-background p-6 w-full max-w-md">
        <FaRegFilePdf className="mx-auto mb-4 w-36 h-36 text-primary-color" />
        <h1 className="text-3xl font-bold text-primary-color text-center mb-4">
          Boas-vindas!
        </h1>
        <p className="text-gray-700 text-center mb-6 leading-relaxed">
          Este é o <strong>Realize Atividades</strong>, nossa nova ferramenta de
          Inteligência Artificial que gera atividades interativas de acordo com
          as competências do seu material didático.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-100 p-6 rounded-lg mb-6 flex flex-col items-center border border-gray-300">
            <FaFileUpload className="mb-4 w-12 h-12 text-gray-600" />
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              multiple
              className="hidden"
              ref={fileInputRef}
            />
            <p className="text-gray-600 font-semibold">
              Arraste e solte arquivos aqui ou{" "}
              <span
                className="text-red-500 font-bold underline cursor-pointer"
                onClick={handleChooseFiles}
              >
                escolha os arquivos
              </span>
            </p>
            <p className="text-gray-500 mt-2 text-sm">
              Tipo de arquivo suportado: <strong>.pdf</strong>
            </p>
          </div>
          {files.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Arquivos Selecionados:</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          <button type="submit" className="button-primary w-full">
            Enviar
          </button>
        </form>
        <p className="text-gray-700 text-center">
          <span className="text-red-500 font-bold underline cursor-pointer">
            Cadastre-se
          </span>{" "}
          para poder baixar arquivos.
        </p>
        <p className="text-gray-700 text-center mt-2">
          Já possui cadastro?{" "}
          <span className="text-red-500 font-bold underline cursor-pointer">
            Faça login
          </span>
        </p>
      </div>
    </div>
  );
}
