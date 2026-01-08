import BlueCar from "../../../assets/images/3d-car-blue.png";
import YellowCar from "../../../assets/images/3d-car-yellow.png";
import "./Ad.scss";

const Ad = () => {
  return (
    <section id="ad">
      <div className="car-img">
        <img src={BlueCar} alt="3d-blue-car" />
        <img src={YellowCar} alt="3d-yellow-car" />
      </div>
      
      <div className="ad-txt">
        <p>정기권으로 ZIO를 더 간편하게 사용해보세요!</p>
      </div>
    </section>
  )
}

export default Ad