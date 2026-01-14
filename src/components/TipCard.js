import './TipCard.scss';
import LightImg from '../assets/images/3d-light.png'

const TipCard = ({title, text}) => {
  return (
    <div className='tip-card'>
      <div className='tip-img'>
        <img src={LightImg} alt='전구 이미지' />
      </div>

      <div className='tip-text'>
        <h3 className='tip-title'>
          {title}
        </h3>
        <p className='tip-txt'>{text}</p>
      </div>
    </div>
  )
}

export default TipCard