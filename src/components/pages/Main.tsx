import Link from 'next/link';
import LoginButton from "@/components/auth/LoginButton";
import Form from "@/components/pages/Form";
import { withUserContext, useUserContext } from "@/contexts/UserContext";

const MainPage = withUserContext(() => {
  const { userId, isLoggedIn } = useUserContext();

  return (<>
    <Form userId={userId} />
    {isLoggedIn ? (
      <Link href="/api/auth/logout">
        Logout
      </Link>
    ) : (
      <LoginButton />
    )}
  </>);
})

export default MainPage;