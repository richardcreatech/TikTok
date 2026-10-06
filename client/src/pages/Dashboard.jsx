import Aside from "../components/Aside";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <main id="my_main_app">
      <Aside />
      <Outlet />
    </main>
  );
}

export default Dashboard;