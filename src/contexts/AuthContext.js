import {createContext, useContext, useState } from "react";
import { guestLogin, signUpUser, updateCarNum, userLogin } from "../api/zioApi";


const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  // user : id, car_num, subs_type, phone, email
  const [user, setUser] = useState(null);

  //guest : g_id, g_phone, g_car_num 
  const [guest, setGuest] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //회원 비회원 구분 
  const authType = user ? "user" : guest ? "guest" : null;

  // 회원 로그인
  const loginUser = async ({userId, password}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userLogin({userId, password});
      setUser(data);
      setGuest(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }finally {
      setLoading(false);
    }
  };

  //비회원 로그인 

  const loginGuest = async ({phone, carNum}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await guestLogin({phone, carNum});
      setGuest(data);
      setUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }finally {
      setLoading(false);
    }
  }

  // 회원가입 
  const signUpUsers = async ({ userId, password, phone, email, carNum }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await signUpUser({ userId, password, phone, email, carNum });
      return data;
    } catch (error) {
      setError(error.message)
      throw error;
    }finally {
      setLoading(false);
    }
  }

  // 로그아웃 
  const logout = () => {
    setUser(null);
    setGuest(null);
    setError(null);
  }

  // 차량정보 변경 
  const changeMyCarNum = async (carNum) => {
    if(!user?.id) throw new Error("사용자 정보 없음");
    const updated = await updateCarNum({userId : user.id, carNum});
    setUser((prev) => ({...prev, car_num:updated.car_num, subs_type:updated.subs_type}))
    return updated;
  }

  return (
    <AuthContext.Provider 
      value = {
        {
          user, guest, authType, loading, error, loginUser, loginGuest, signUpUsers, logout,changeMyCarNum
        }
      }>
      {children}
    </AuthContext.Provider>
  )

}
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 AuthProvider 안에서만 사용 가능");
  return ctx;
};
// 사용 시 const {user} = useAuth(); 식으로 사용하면 됨 
// const { user } = useContext(AuthContext); => 번거로움 
//provider로 감싸고 사용하라는 에러 메세지 출력 

/* 사용 예시 

import { useAuth } from "../contexts/AuthContext";

const MyPage = () => {
  const { user, authType, logout } = useAuth();

  if (authType !== "member") return <p>로그인 필요</p>;

  return (
    <>
      <p>{member.id}</p>
      <button onClick={logout}>로그아웃</button>
    </>
  );
};

 */