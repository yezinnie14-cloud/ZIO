import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk"
import { useParking } from "../../../contexts/ParkingContext"
import { useEffect, useMemo, useRef } from "react"

const center = { lat: 37.266, lng: 126.999 }

export default function ParkingMap({ keyword, selected, onSelectItem }) {
  const { lots, fatchParkingLots, loadingMain, error } = useParking()
  const mapRef = useRef(null)

  const [loadingMap, errorMap] = useKakaoLoader({
    appkey: process.env.REACT_APP_KAKAO_MAP_KEY,
    libraries: ["services"],
  })

  useEffect(() => {
    fatchParkingLots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ 1) 필드명 정규화 (name/lat/lng/address로 통일)
  const normalizedLots = useMemo(() => {
    const base = Array.isArray(lots) ? lots : []
    return base.map((p) => ({
      ...p,
      // 이름 후보들
      name: p.name ?? p.parking_name ?? p.parkingName ?? p.title ?? "",
      // 주소 후보들
      address: p.address ?? p.addr ?? p.location ?? "",
      // 좌표 후보들
      lat: Number(p.lat ?? p.latitude ?? p.latitude),
      lng: Number(p.lng ?? p.longitude ?? p.lon ?? p.lot),
    }))
  }, [lots])

  // ✅ 2) 검색 필터
  const filteredLots = useMemo(() => {
    const q = (keyword ?? "").trim().toLowerCase()
    if (!q) return normalizedLots
    return normalizedLots.filter((p) => (p.name || "").toLowerCase().includes(q))
  }, [normalizedLots, keyword])

  // ✅ 3) NaN 좌표 제거 (이거 없으면 마커 0개 나와도 이상하지 않음)
  const markers = useMemo(() => {
    return filteredLots.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
  }, [filteredLots])

  // ✅ 선택 시 panTo
  useEffect(() => {
    if (!selected || !mapRef.current) return
    const lat = Number(selected.lat ?? selected.latitude)
    const lng = Number(selected.lng ?? selected.longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    const moveLatLng = new window.kakao.maps.LatLng(lat, lng)
    mapRef.current.panTo(moveLatLng)
  }, [selected])

  if (loadingMap) return <div>지도 로딩중...</div>
  if (errorMap) return <div>지도 SDK 에러: {String(errorMap)}</div>
  if (loadingMain) return <div>로딩중...</div>
  if (error) return <div>{String(error)}</div>

  return (
    <Map
      center={center}
      style={{ width: "100%", height: "100vh" }}
      level={4}
      onCreate={(map) => (mapRef.current = map)}
    >
      {markers.map((p) => (
        <MapMarker
          key={p.id}
          position={{ lat: p.lat, lng: p.lng }}
          title={p.name}
          onClick={() => onSelectItem?.(p)}
        />
      ))}
    </Map>
  )
}





