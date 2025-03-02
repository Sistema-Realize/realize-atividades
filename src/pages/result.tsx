import { useEffect, useState } from "react";
import fileDownload from "js-file-download";
import PaymentButton from "@/components/paymentButton";

interface Questao {
  id: number;
  texto: string;
}

interface Data {
  competencia: string;
  valor: number;
  questoes: Questao[];
}

export default function Result() {
  const [data, setData] = useState<Data | null>(null);
  const [paymentConfirmed] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Obtém os dados do usuário autenticado
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        const result = await response.json();
        if (result.user) {
          setUserId(result.user.sub);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }
    fetchUser();
  }, []);

  // Obtém os dados fictícios e arquivos enviados
  useEffect(() => {
    async function fetchData() {
      try {
        const resData = await fetch("/api/fakeData");
        const fakeData = await resData.json();
        if (fakeData.data) {
          setData(fakeData.data);
        }

        const resFiles = await fetch("/api/upload");
        const fileData = await resFiles.json();
        setUploadedFiles(Array.isArray(fileData.files) ? fileData.files : []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  // Função para baixar o arquivo como Word
  const handleDownload = () => {
    if (!data || !paymentConfirmed) {
      alert("Pagamento não confirmado.");
      return;
    }

    const content = `
      Competência: ${data.competencia}\n
      Questões:\n
      ${data.questoes.map((questao) => `- ${questao.texto}`).join("\n")}
    `;
    fileDownload(content, "resultado.doc");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="form-background p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary-color text-center mb-4">
          Resultado
        </h1>
        {data ? (
          <div>
            <h2 className="text-lg font-semibold">Competência:</h2>
            <p className="mb-4">{data.competencia}</p>
            <h2 className="text-lg font-semibold">Questões:</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {data.questoes.map((questao) => (
                <li key={questao.id}>{questao.texto}</li>
              ))}
            </ul>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Opções de Pagamento:</h2>
              <p className="mb-2">Valor: R$ {data.valor.toFixed(2)}</p>
              {userId ? (
                <PaymentButton userId={userId} paymentMethod="CREDIT_CARD" />
              ) : (
                <p className="text-sm text-gray-500">
                  Carregando informações do usuário...
                </p>
              )}
            </div>
            <button
              onClick={handleDownload}
              className={`button-primary mt-4 w-full ${
                paymentConfirmed ? "" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!paymentConfirmed}
            >
              Baixar como Word
            </button>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Arquivos Enviados:</h2>
              {uploadedFiles.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>{file}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum arquivo enviado.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Carregando dados...</p>
        )}
      </div>
    </div>
  );
}
