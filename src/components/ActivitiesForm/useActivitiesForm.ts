import { useState, useCallback, ChangeEvent } from 'react';

interface UploadedFile {
  name: string;
  size: string;
}

interface FormData {
  files: UploadedFile[];
  amount: string;
  difficulty: string[];
}

interface UseActivitiesFormReturn {
  formData: FormData;
  isFormValid: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAmountChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDifficultyChange: (value: string) => void;
  removeFile: (fileName: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

export function useActivitiesForm(): UseActivitiesFormReturn {
  const [formData, setFormData] = useState<FormData>({
    files: [],
    amount: '',
    difficulty: [],
  });

  const isFormValid = useCallback(() => {
    return (
      formData.files.length > 0 &&
      formData.amount !== '' &&
      formData.difficulty.length > 0
    );
  }, [formData]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

      if (validFiles.length !== files.length) {
        alert('Alguns arquivos excedem o limite de 100MB e foram ignorados.');
      }

      const newFiles = validFiles.map((file) => ({
        name: file.name,
        size: formatFileSize(file.size),
      }));

      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    },
    []
  );

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

  const removeFile = useCallback((fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.name !== fileName),
    }));
  }, []);

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (isFormValid()) {
        console.log('Form submitted:', formData);
      }
    },
    [formData, isFormValid]
  );

  return {
    formData,
    isFormValid: isFormValid(),
    onFileChange,
    onAmountChange,
    onDifficultyChange,
    removeFile,
    onSubmit,
  };
} 