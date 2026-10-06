import { Outlet } from "react-router-dom";

function Auth() {
  return (
    <main id="auth_pg">
      <Outlet />
    </main>
  );
}

export default Auth;