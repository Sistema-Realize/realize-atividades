import ActivitiesForm from "@/components/ActivitiesForm";

export default function FormPage({ user_id }: { user_id: string }) {
  return (
    <div>
      <ActivitiesForm user_id={user_id} />
    </div>
  );
}
