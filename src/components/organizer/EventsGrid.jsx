import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import EventCard from './EventCard';

function EventsGrid({ events, title }) {
  
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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