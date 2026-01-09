import { AuthProvider } from "./AuthContext"
import { ParkingProvider } from "./ParkingContext"
import { ReservationProvider } from "./ReservationContext"

// context 관리용 appProvider 폴더 
const AppProvider = ({children}) => {
  return (
    <AuthProvider>
      <ParkingProvider>
        <ReservationProvider>
          {children}
        </ReservationProvider>
      </ParkingProvider>
    </AuthProvider>
  )
}

export default AppProvider