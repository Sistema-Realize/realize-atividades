import { useEffect, useState } from "react";
import { useUserContext, withUserContext } from "@/contexts/UserContext";
import Image from "next/image";
import axios from "axios";

type SubscriptionData = {
  dateCreated: string;
  value: number;
  status: string;
  nextDueDate: string;
};

const User = withUserContext(() => {
  const { userId, isLoggedIn } = useUserContext();
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribing, setUnsubscribing] = useState(false);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!isLoggedIn) return;

      try {
        setLoading(true);
        const response = await axios.get("/api/subscription");
        console.log("API Response:", response.data);

        // Verificar se a resposta tem a estrutura esperada
        if (response.data && response.data.isActive !== undefined) {
          // Formato da resposta é { isActive: boolean }
          setSubscriptionData({
            dateCreated: "N/A", // Valores padrão
            value: 0,
            status: response.data.isActive ? "ACTIVE" : "INACTIVE",
            nextDueDate: "N/A",
          });
        } else if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          // Formato da resposta é { data: [...subscriptions] }
          const activeSubscription = response.data.data.find(
            (sub: { status: string }) => sub.status === "ACTIVE"
          );

          if (activeSubscription) {
            setSubscriptionData({
              dateCreated: activeSubscription.dateCreated || "N/A",
              value: activeSubscription.value || 0,
              status: activeSubscription.status || "N/A",
              nextDueDate: activeSubscription.nextDueDate || "N/A",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching subscription data:", err);
        setError("Falha ao carregar dados da assinatura");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [isLoggedIn, userId]);

  const handleUnsubscribe = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) {
      return;
    }

    try {
      setUnsubscribing(true);
      const response = await axios.post("/api/deleteSubscription");
      console.log("Delete Response:", response.data);

      setSubscriptionData((prev) =>
        prev ? { ...prev, status: "INACTIVE" } : null
      );
      alert("Assinatura cancelada com sucesso");
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      setError("Falha ao cancelar assinatura");
    } finally {
      setUnsubscribing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-accent-color">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <p className="text-center text-muted-color">
            Você precisa estar logado para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-accent-color">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/realizeAtividadelogo.png"
            alt="Realize Atividade Logo"
            width={200}
            height={80}
            priority
          />
        </div>

        <h1 className="text-center text-2xl font-bold text-primary-color mb-6">
          Minha conta
        </h1>

        <h2 className="text-xl font-semibold text-title-color mb-4">
          Dados da Assinatura
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-muted-color">
            Carregando dados da assinatura...
          </p>
        ) : subscriptionData ? (
          <div className="space-y-4">
            <div className="text-primary-color p-4 rounded-md">
              <p className="mb-2">
                <strong>Data de Criação:</strong> {subscriptionData.dateCreated}
              </p>
              <p className="mb-2 text-muted-color">
                <strong>Valor:</strong> R$ {subscriptionData.value.toFixed(2)}
              </p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    subscriptionData.status === "ACTIVE"
                      ? "text-green-600 font-semibold"
                      : "text-red-600"
                  }
                >
                  {subscriptionData.status === "ACTIVE" ? "Ativo" : "Inativo"}
                </span>
              </p>
              <p className="mb-2">
                <strong className="text-muted-color">
                  Próxima Data de Vencimento:
                </strong>{" "}
                {subscriptionData.nextDueDate}
              </p>
            </div>

            {subscriptionData.status === "ACTIVE" && (
              <button
                onClick={handleUnsubscribe}
                disabled={unsubscribing}
                className="mt-4 w-full button-primary-color py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
              >
                {unsubscribing ? "Cancelando..." : "Cancelar Assinatura"}
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-primary-color">
            Nenhuma assinatura encontrada.
          </p>
        )}
      </div>
    </div>
  );
});

export default User;
