import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import MainPage from "./pages/MainPage";
import ReservationPage from "./pages/ReservationPage";
import PaymentPage from "./pages/PaymentPage";
import MyPage from "./pages/MyPage";
import Tip from "./pages/Tip";
import AuthPage from "./pages/AuthPage"

import { AuthProvider } from "./contexts/AuthContext";
import { ParkingProvider } from "./contexts/ParkingContext";
import { ReservationProvider } from "./contexts/ReservationContext";

import "./App.scss";
import DetailPage from "./pages/DetailPage";
import SignupPage from "./pages/SignupPage";
import GuestLoginPage from "./pages/GuestLoginPage";

const App = () => {
  return (
    <AuthProvider>
      <ParkingProvider>
        <ReservationProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/parking/:parkingId" element={<ReservationPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/tip" element={<Tip />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/guest-login" element={<GuestLoginPage />} />
              <Route path="/detail" element={<DetailPage />} />
            </Route>
          </Routes>
        </ReservationProvider>
      </ParkingProvider>
    </AuthProvider>
  );
};

export default App;
