import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import GnbDesktop from "../components/common/GnbDesktop";
import GnbMobile from "../components/common/GnbMobile";
import DetailAsidePage from "../pages/section/detail/DetailAsidePage";

  
const Layout = () => {
  const { pathname } = useLocation();

  const isDetail = pathname.startsWith("/detail");
  return (
    <div id="app">
      <Header />
      {/* 데스크탑일 때  */}
        
      <main className="layout-main">
        <section className="sec1">
        <GnbDesktop /> 
        <Footer/>
        </section>
        <section className="layout-outlet">
        <Outlet />
        </section>
        <section className="sec3">
          {isDetail ? <DetailAsidePage /> : null}
        </section>
      </main>
      
      
      {/* 모바일일 때 아래 탭 */}
        <GnbMobile />
    </div>
  );
};

export default Layout;
