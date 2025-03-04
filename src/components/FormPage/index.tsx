import Form from "@/components/form";

export default function FormPage({ user_id }: { user_id: string }) {
  return (
    <div>
      <Form user_id={user_id} />
    </div>
  );
}
