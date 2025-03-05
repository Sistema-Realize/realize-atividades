import { useState, useCallback, ChangeEvent, useRef, useMemo } from 'react';
import { formatFileSize } from '@/utils/formatFileSize';

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
}

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
}

type FormSteps = 'UPLOAD_FILES' | 'UPLOADED' | 'OPTIONS' | 'SUCCESS';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
export const DIFFICULTY_OPTIONS = ['Fácil', 'Médio', 'Difícil'];

export function useActivitiesForm(props: useActivitiesFormProps): UseActivitiesFormReturn {
  const { onSubmit: onSubmitProps } = props;

  const [formStep, setFormStep] = useState<FormSteps>('UPLOAD_FILES');
  const [formData, setFormData] = useState<FormData>({
    files: [],
    amount: '',
    difficulty: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rawFilesRef = useRef<File[]>([]);

  const isFormValid = useMemo(() => formData.files.length > 0 &&
  formData.amount !== '' &&
  formData.difficulty.length > 0, [formData]);

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

      if (validFiles.length !== files.length) {
        alert('Alguns arquivos excedem o limite de 100MB e foram ignorados.');
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

      setFormStep('UPLOADED');
    },
    []
  );

  const onRemoveFile = useCallback((fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.name !== fileName),
    }));
    
    rawFilesRef.current = rawFilesRef.current.filter(
      (file) => file.name !== fileName
    );
  }, []);

  const onAmountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (parseInt(value) <= 50 || value === '') {
        setFormData((prev) => ({
          ...prev,
          amount: value,
        }));
      }
    },
    []
  );

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

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!isFormValid) return;

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const formDataToSend = new FormData();
        formDataToSend.append('amount', formData.amount);
        formData.difficulty.forEach((diff) => {
          formDataToSend.append('difficulty', diff);
        });
        rawFilesRef.current.forEach((file) => {
          formDataToSend.append('Files', file);
        });

        await onSubmitProps(formDataToSend);

        setFormStep('SUCCESS');
        
        // Reset form after successful submission
        setFormData({
          files: [],
          amount: '',
          difficulty: [],
        });
        rawFilesRef.current = [];
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Error submitting form');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isFormValid, onSubmitProps]
  );

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
  };
} 