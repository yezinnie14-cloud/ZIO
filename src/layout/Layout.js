import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import GnbDesktop from "../components/common/GnbDesktop";
import GnbMobile from "../components/common/GnbMobile";
import DetailAsidePage from "../pages/section/detail/DetailAsidePage";
import { useEffect } from "react";
import { useState } from "react";
import { useParking } from "../contexts/ParkingContext";
import Popup from "../components/common/Popup";

const Layout = () => {
  const { pathname } = useLocation();
  const { lots } = useParking()
    const [open, setOpen] = useState(false)
    const [keyword, setKeyword] = useState("")
    const [view, setView] = useState("list")
    const [selected, setSelected] = useState(null)
    const isMain = pathname === "/"

  
    const openPopup = () => {
      setOpen(true)
      setView("list")
      setSelected(null)
    }
  
    const closePopup = () => {
      setOpen(false)
      setView("list")
      setSelected(null)
    }
  
    const handleSelectItem = (item) => {
      setSelected(item)
      setView("detail")
      setOpen(true) // 마커 클릭으로도 팝업 열림
    }
  
    useEffect(() => {
      document.body.style.overflow = open ? "hidden" : ""
      return () => (document.body.style.overflow = "")
    }, [open])

  const isDetail = pathname.startsWith("/detail");
  return (
    <div id="app">
      <Header  onOpenPopup={openPopup} keyword={keyword} setKeyword={setKeyword}/>
      {/* 데스크탑일 때  */}

      <main className="layout-main">
        <section className="sec1">
          <GnbDesktop />
          <div className="layout-footer">
            <Footer />
          </div>
        </section>
        <section className="layout-outlet">
        <Outlet         
        context={{
          open,
          keyword,
          setKeyword,
          view,
          setView,
          selected,
          setSelected,
          openPopup,
          closePopup,
          handleSelectItem,
        }}
/>
        </section>
        <Popup
        open={open}
        onClose={closePopup}
        keyword={keyword}
        setKeyword={setKeyword}
        view={view}
        selected={selected}
        list={lots}                 
        onSelectItem={handleSelectItem}
        onBack={() => setView("list")}
      />
      {!isMain &&
        <section className="sec3">
          {isDetail ? <DetailAsidePage /> : null}
        </section>
        }
      </main>

      {/* 모바일일 때 아래 탭 */}
      <GnbMobile />
    </div>
  );
};

export default Layout;
