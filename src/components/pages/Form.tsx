import ActivitiesForm from "@/components/ActivitiesForm";

type FormProps = { userId: string };

export default function Form(props: FormProps) {
  return (
    <div>
      {props.userId}
      <ActivitiesForm />
    </div>
  );
}
