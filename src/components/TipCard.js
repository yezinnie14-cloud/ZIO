import './TipCard.scss';
import LightImg from '../assets/images/3d-light.png'

const TipCard = ({title, text, icon}) => {
  return (
    <div className='tip-card'>
      <div className='tip-img'>
        <img src={LightImg} alt='전구 이미지' />
      </div>

      <div className='tip-text'>
        <h3 className='tip-title'>
          {/* {icon && <div className='tip-icon'>{icon}</div>}{title} */}
          {title}
        </h3>
        <p className='tip-txt'>{text}</p>
      </div>
    </div>
  )
}

export default TipCard