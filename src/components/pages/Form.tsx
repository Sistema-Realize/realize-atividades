import { useCallback } from 'react';
import axios from 'axios';
import ActivitiesForm from "@/components/ActivitiesForm";

type FormProps = {
  userId: string;
};

export default function Form(props: FormProps) {
  const onSubmit = useCallback(async (formData: globalThis.FormData) => {
    await axios.post('/api/activities/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, []);
  return (
    <div>
      {props.userId}
      <ActivitiesForm onSubmit={onSubmit} />
    </div>
  );
}
