import Header from "../components/ui/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
