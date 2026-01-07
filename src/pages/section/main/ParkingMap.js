import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState } from "react";

const center = { lat: 33.450701, lng: 126.570667 };

export default function AddMapClickEventWithMarker() {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.REACT_APP_KAKAO_MAP_KEY,
  });

  const [position, setPosition] = useState(null);

  if (loading) return <div>지도 로딩중...</div>;
  if (error) return <div>지도 로딩 실패</div>;

  return (
    <>
      <Map
        center={center}
        style={{ width: "100%", height: "100vh" }}
        level={3}
        onClick={(_, mouseEvent) => {
          const latlng = mouseEvent.latLng;
          setPosition({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          });
        }}
      >
        {position && <MapMarker position={position} />}
      </Map>
    </>
  );
}
