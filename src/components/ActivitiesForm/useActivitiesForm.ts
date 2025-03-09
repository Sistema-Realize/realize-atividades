import { useState, useCallback, ChangeEvent, useRef, useMemo, useEffect } from "react";
import { formatFileSize } from "@/utils/formatFileSize";
import { useUserContext } from "@/contexts/UserContext";
import { getListActivities } from '@/utils/getListActivities';

interface UploadedFile {
  name: string;
  size: string;
}

interface FormData {
  files: UploadedFile[];
  amount: string;
  difficulty: string[];
}

type useActivitiesFormProps = {
  onSubmit: (formData: globalThis.FormData) => Promise<void>;
};

interface UseActivitiesFormReturn {
  formStep: FormSteps;
  setFormStep: (step: FormSteps) => void;
  formData: FormData;
  isFormValid: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDifficultyChange: (value: string) => void;
  onRemoveFile: (fileName: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  createPayment: () => Promise<void>;
  checkPaymentLink: () => Promise<void>;
}

type FormSteps =
  | "UPLOAD_FILES"
  | "REUPLOAD_FILES"
  | "UPLOADED"
  | "OPTIONS"
  | "LOGIN"
  | "SUBSCRIPTION"
  | "SUCCESS";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
export const DIFFICULTY_OPTIONS = ["Fácil", "Médio", "Difícil"];

const STORAGE_KEY = 'activities-form-data';

export function useActivitiesForm(
  props: useActivitiesFormProps
): UseActivitiesFormReturn {
  const { onSubmit: onSubmitProps } = props;

  const { isLoggedIn, isSubscriptionActive } = useUserContext();

  const [formStep, setFormStep] = useState<FormSteps>("UPLOAD_FILES");
  const [formData, setFormData] = useState<FormData>({
    files: [],
    amount: "",
    difficulty: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rawFilesRef = useRef<File[]>([]);

  const isFormValid = useMemo(
    () =>
      formData.files.length > 0 &&
      formData.amount !== "" &&
      formData.difficulty.length > 0,
    [formData]
  );

  const onFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

    if (validFiles.length !== files.length) {
      alert("Alguns arquivos excedem o limite de 100MB e foram ignorados.");
    }

    rawFilesRef.current = [...rawFilesRef.current, ...validFiles];

    const newFiles = validFiles.map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
    }));

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));

    setFormStep("UPLOADED");
  }, []);

  const onRemoveFile = useCallback((fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.name !== fileName),
    }));

    rawFilesRef.current = rawFilesRef.current.filter(
      (file) => file.name !== fileName
    );
  }, []);

  const onAmountChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (parseInt(value) <= 50 || value === "") {
      setFormData((prev) => ({
        ...prev,
        amount: value,
      }));
    }
  }, []);

  const onDifficultyChange = useCallback((value: string) => {
    setFormData((prev) => {
      const newDifficulty = prev.difficulty.includes(value)
        ? prev.difficulty.filter((item) => item !== value)
        : [...prev.difficulty, value];

      return {
        ...prev,
        difficulty: newDifficulty,
      };
    });
  }, []);

  const saveFormState = useCallback(() => {
    const dataToStore = {
      amount: formData.amount,
      difficulty: formData.difficulty,
      step: 'REUPLOAD_FILES'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  }, [formData.amount, formData.difficulty]);

  const clearFormState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!isFormValid) return;

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("amount", formData.amount);
        formData.difficulty.forEach((diff) => {
          formDataToSend.append("difficulty", diff);
        });
        rawFilesRef.current.forEach((file) => {
          formDataToSend.append("Files", file);
        });

        if (!isLoggedIn) {
          saveFormState();
          setFormStep("LOGIN");
          return;
        }

        if (!isSubscriptionActive && Number(formData.amount) > 1) {
          saveFormState();
          setFormStep("SUBSCRIPTION");
          return;
        } else if(!isSubscriptionActive){
          const response = await getListActivities();
          
          if (response.data.length > 0) {
            saveFormState();
            setFormStep('SUBSCRIPTION');
            return;
          }
        }

        clearFormState();
        await onSubmitProps(formDataToSend);

        setFormStep("SUCCESS");

        setFormData({
          files: [],
          amount: "",
          difficulty: [],
        });
        rawFilesRef.current = [];
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Error submitting form"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isFormValid, onSubmitProps, isLoggedIn, isSubscriptionActive, saveFormState, clearFormState]
  );

  const createPayment = async () => {
    try {
      const response = await fetch("/api/createPaymentlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro desconhecido: ${response.status}`);
      }

      if (data.paymentLinkUrl) {
        window.location.href = data.paymentLinkUrl;
      } else {
        console.error("Link de pagamento não retornado.");
        alert("Falha ao obter link de pagamento.");
      }
    } catch (error) {
      console.error("Erro na API de pagamento:", error);
      alert("Erro ao processar pagamento.");
    }
  };

  const checkPaymentLink = async () => {
    try {
      const response = await fetch("/api/checkPaymentLink", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 404) {
        alert("Sem assinatura ativa, você pode enviar apenas 1 arquivo.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Erro desconhecido: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("[🔐 DATA]", data);

      if (data.paymentLinkUrl) {
        window.location.href = data.paymentLinkUrl;
      } else {
        console.error("Link de pagamento não retornado.");
        alert("Falha ao obter link de pagamento.");
      }
    } catch (error) {
      console.error("Erro na verificação do link de pagamento:", error);
      alert("Erro ao processar a verificação de pagamento.");
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const { amount, difficulty, step } = JSON.parse(storedData);
        setFormData(prev => ({
          ...prev,
          amount,
          difficulty
        }));
        setFormStep(step);
      } catch (error) {
        console.error('Error parsing stored form data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  return {
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
    checkPaymentLink,
  };
}
