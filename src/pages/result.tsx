import { useEffect, useState } from "react";
import fileDownload from "js-file-download";
import { FaCreditCard } from "react-icons/fa";

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
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    // Buscar dados da API fake
    fetch("/api/fakeData")
      .then((res) => res.json())
      .then((result) => setData(result.data));

    // Simule a obtenção dos arquivos enviados
    fetch("/api/upload")
      .then((res) => res.json())
      .then((data) => setUploadedFiles(data.files));

    // Simular a verificação do pagamento via webhook
    const checkPaymentStatus = async () => {
      // Aqui você pode fazer uma chamada para verificar o status do pagamento
      // ou atualizar o estado com base em uma notificação de webhook
      // Exemplo: setPaymentConfirmed(true) quando o pagamento for confirmado
    };

    checkPaymentStatus();
  }, []);

  const handleDownload = () => {
    if (data) {
      const content = `
        Competência: ${data.competencia}\n
        Questões:\n
        ${data.questoes.map((questao) => `- ${questao.texto}`).join("\n")}
      `;
      fileDownload(content, "resultado.doc");
    } else {
      alert("Pagamento não confirmado.");
    }
  };

  const handlePayment = () => {
    // Abrir o link de pagamento do Asaas em uma nova aba
    window.open("https://sandbox.asaas.com/c/ro4fw90olj1m5o31", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="form-background p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary-color text-center mb-4">
          Resultado
        </h1>
        {data && (
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
              <button
                onClick={handlePayment}
                className="button-primary w-full flex items-center justify-center gap-2"
              >
                <FaCreditCard />
                Pagar com Asaas
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="button-primary mt-4 w-full bg-gray-400 cursor-not-allowed"
              disabled
            >
              Baixar como Word
            </button>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Arquivos Enviados:</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
