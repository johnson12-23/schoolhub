import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function AppLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf4_0%,#f8fafc_18%,#f8fafc_100%)]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;

