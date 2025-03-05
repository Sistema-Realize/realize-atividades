import ActivitiesForm from "@/components/ActivitiesForm";
import { useForm } from "./useForm";

type FormProps = {
  userId: string;
};

export default function Form(props: FormProps) {
  const { onSubmit } = useForm();
  return (
    <div>
      {props.userId}
      <ActivitiesForm onSubmit={onSubmit} />
    </div>
  );
}
