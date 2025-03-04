import ActivitiesForm from "@/components/ActivitiesForm";

type FormProps = { userId: string };

export default function Form(props: FormProps) {
  return (
    <div>
      <ActivitiesForm user_id={props.userId} />
    </div>
  );
}
