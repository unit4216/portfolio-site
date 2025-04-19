import './App.css'
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {useState} from "react";

const tempImageUrl = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTndJ4Jo28CzEptSe8QOfo6UaEs5E1Hs84izu8hQTkpdjtj0E0G6f6u9CYeH_p47yZRCmnixLp2gIAGBY9r6SYpxA"

const SLIDES = [
    {title: 'Project 1', imgUrl: tempImageUrl },
    {title: 'Project 2', imgUrl: tempImageUrl },
    {title: 'Project 3', imgUrl: tempImageUrl },
    {title: 'Project 4', imgUrl: tempImageUrl }
]


function ProjectCarousel() {
    const [atStart, setAtStart] = useState<boolean>(true)
    const [atEnd, setAtEnd] = useState<boolean>(false)


    return (
        <div className="w-full flex flex-row items-center gap-x-4 mx-auto">
            {/* Left Arrow */}
            <div
                style={{visibility: !atStart ? 'visible' : 'hidden'}}
                className="swiper-button-prev-custom cursor-pointer text-2xl">
                {"<"}
            </div>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={3}
                navigation={{
                    prevEl: '.swiper-button-prev-custom',
                    nextEl: '.swiper-button-next-custom',
                }}
                onSlideChange={(swiper) => {
                    setAtStart(swiper.isBeginning);
                    setAtEnd(swiper.isEnd);
                }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {SLIDES.map(slide=>{
                    return (<SwiperSlide>
                        {slide.title}
                        <img src={slide.imgUrl} alt={slide.title} className='w-[370px] h-[560px]'/>
                    </SwiperSlide>)
                })}

            </Swiper>
            {/* Right Arrow */}
            <div
                style={{visibility: !atEnd ? 'visible' : 'hidden'}}
                 className="swiper-button-next-custom cursor-pointer text-2xl">
                {">"}
            </div>
        </div>
    );
}

function App() {

    const sections = ["Work", 'About', 'Contact']

  return (
    <>
      <div
          className='text-[#282828] px-20 py-4 w-[100vw] bg-[#F5F5F5]'
          style={{fontFamily: 'Neue Haas Grotesk'}}
      >
          <div className='flex flex-row justify-end'>
              <div className='flex flex-row gap-x-4 text-[25px]'>
                  {sections.map(section=>{
                      return <div>{section}</div>
                  })}
              </div>
          </div>
          <div className='text-[69px] mt-44'>
              Pablo Paliza
          </div>
          <div className='text-[25px]'>Full stack software developer</div>
          <div className='text-[45px] mt-44'>Projects</div>
          <hr className='mb-32'/>
          <ProjectCarousel />
      </div>
    </>
  )
}

export default App
