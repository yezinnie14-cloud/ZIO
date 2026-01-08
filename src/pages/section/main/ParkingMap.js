import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import  supabase  from "../../../api/supabaseClient";

// ✅ 우리가 가설정한 지도 중심
const center = { lat: 37.2636, lng: 127.0286 }; // 예: 수원

export default function ParkingMap() {
  const [loadingMap, error] = useKakaoLoader({
    appkey: process.env.REACT_APP_KAKAO_MAP_KEY,
  });

  const [parkings, setParkings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchParkings = async () => {
      setLoadingData(true);

      const { data, error } = await supabase
        .from("parkings") // 👉 네 테이블명
        .select("id, name, lat, lng");

      if (error) {
        console.error("Supabase error:", error);
        setParkings([]);
      } else {
        setParkings(data ?? []);
      }

      setLoadingData(false);
    };

    fetchParkings();
  }, []);

  if (loadingMap) return <div>지도 로딩중...</div>;
  if (error) return <div>지도 로딩 실패</div>;

  return (
    <>
      <Map
        center={center}
        style={{ width: "100%", height: "100vh" }}
        level={4}
      >
        {parkings.map((p) => (
          <MapMarker
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            title={p.name}
          />
        ))}
      </Map>

      {loadingData && <div>주차장 데이터 불러오는 중…</div>}
    </>
  );
}

