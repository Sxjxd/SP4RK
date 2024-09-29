import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import local images from the assets folder
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/rent-bike.png';

const BannerSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  const banners = [
    {
      imageUrl: banner1,  // Use imported local image
    },
    {
      imageUrl: banner2,  // Use imported local image
    },
    // Add more banner slides as needed
  ];

  return (
    <div className="relative">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="relative">
            <img
              src={banner.imageUrl}
              alt={`Banner ${index + 1}`}  // Updated alt text
              className="w-full h-[80vh] object-cover" // Reduced the height to 70vh
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center max-w-lg px-4">
                <h1 className="text-3xl font-bold mb-2 md:text-4xl">{banner.heading}</h1>
                <p className="text-base md:text-lg mb-4">{banner.subheading}</p>
                <p className="text-xl md:text-2xl font-semibold">{banner.price}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
