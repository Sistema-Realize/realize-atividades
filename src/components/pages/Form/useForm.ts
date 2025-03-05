import { useCallback } from "react";
import axios from "axios";

export const useForm = () => {
  const onSubmit = useCallback(async (formData: globalThis.FormData) => {
    await axios.post('/api/activities/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, []);

  return {
    onSubmit,
  };
};