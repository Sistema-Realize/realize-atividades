import Form from "@/components/pages/Form";
import { withUserContext, useUserContext } from "@/contexts/UserContext";

const Main = withUserContext(() => {
  const { userId } = useUserContext();

  return (
    <>
      <Form userId={userId} />
    </>
  );
});

export default Main;
