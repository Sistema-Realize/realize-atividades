import { useState } from "react";
import axios from "axios";
import { FaCreditCard } from "react-icons/fa";

interface PaymentButtonProps {
  userId: string;
  paymentMethod: "BOLETO" | "CREDIT_CARD" | "PIX";
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  userId,
  paymentMethod,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/payment/createLink", {
        userId,
        paymentMethod,
      });
      window.location.href = data.paymentLink;
    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error);
      alert("Erro ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="button-primary w-full flex items-center justify-center gap-2"
      disabled={loading}
    >
      <FaCreditCard />
      {loading ? "Processando..." : "Pagar"}
    </button>
  );
};

export default PaymentButton;
