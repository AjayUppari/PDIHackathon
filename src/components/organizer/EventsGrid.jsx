import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 
import EventCard from './EventCard';

function EventsGrid({ events, title }) {


  const PrevArrow = ({ onClick }) => (
    <div
      className="slick-prev"
      style={{ color: 'black', fontSize: '24px', left: '-30px' }} // Adjust styling as needed
      onClick={onClick}
    >
      <FaArrowLeft />
    </div>
  );
  
  const NextArrow = ({ onClick }) => (
    <div
      className="slick-next"
      style={{ color: 'black', fontSize: '24px', right: '-30px' }} // Adjust styling as needed
      onClick={onClick}
    >
      <FaArrowRight />
    </div>
  );
  
  
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />, // Use the custom prevArrow component
  nextArrow: <NextArrow />
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#07003D] mb-4">{title}</h2>
        <div>
          <Slider {...settings}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Slider>
        </div>
    </div>
  );
}

export default EventsGrid;