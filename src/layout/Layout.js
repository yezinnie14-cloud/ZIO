import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import GnbDesktop from "./GnbDesktop";
import GnbMobile from "./GnbMobile";
const Layout = () => {
  return (
    <div id="app">
      <Header />
        <GnbDesktop />
      <main>
        <Outlet />
      </main>
      
      <Footer/>
        <GnbMobile />
    </div>
  );
};

export default Layout;
