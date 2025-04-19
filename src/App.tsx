import './App.css'
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {useState} from "react";
import {ArrowBackIos, ArrowForwardIos, Circle, KeyboardArrowDown} from '@mui/icons-material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {TextField} from "@mui/material";



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
        <div className="w-4/5 mx-auto flex flex-row items-center gap-x-4">
            {/* Left Arrow */}
            <div
                style={{visibility: !atStart ? 'visible' : 'hidden'}}
                className="swiper-button-prev-custom cursor-pointer text-2xl">
                <ArrowBackIos />
            </div>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
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
                    return (
                        <SwiperSlide >
                        <div className="text-[30px]">{slide.title}</div>
                        <img src={slide.imgUrl} alt={slide.title} className='w-[370px] h-[560px] rounded-md' />
                    </SwiperSlide>
                    )
                })}

            </Swiper>
            {/* Right Arrow */}
            <div
                style={{visibility: !atEnd ? 'visible' : 'hidden'}}
                 className="swiper-button-next-custom cursor-pointer text-2xl">
                <ArrowForwardIos />
            </div>
        </div>
    );
}

const ResumeAccordion = () => {

    const EXPERIENCES = [
        {title: 'Westland', description: 'Worked at Westland.'},
        {title: 'Paliza Consulting', description: 'Worked at Paliza Consulting.'},
        {title: 'Synergy', description: 'Worked at Synergy IT.'}
    ]


    return (
        <div>
            {EXPERIENCES.map(experience => (
                <Accordion
                    className="!bg-transparent !shadow-none border-b-[1px] border-[#282828] !rounded-none"
                    sx={{ '&::before': { display: 'none' } }}
                >
                <AccordionSummary
                    expandIcon={<KeyboardArrowDown className='text-[#282828]'/>}
                >
                    <div className='text-[30px]'>{experience.title}</div>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='text-[20px]'>
                        {experience.description}
                    </div>
                </AccordionDetails>
            </Accordion>))}
        </div>
    )
}

const CustomHR = () => {
    return <hr className='mb-32 border-t-[1px] text-[#282828] border-[#282828]'/>
}

const StyledTextField = ({rows=1}: {rows?: number}) =>{
    return (
        <TextField
            rows={rows}
            multiline
            placeholder={"Placeholder"}
            sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                '& fieldset': {
                    borderWidth: '2px',
                    borderColor: '#000',
                },
                '&:hover fieldset': {
                    borderColor: '#000',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#000',
                },
            },
        }}/>
    )
}

export const ContactForm = () => {
    return (
        <div className='flex flex-col gap-y-2'>
            <StyledTextField />
            <StyledTextField />
            <StyledTextField rows={5}/>
        </div>
    )
}

function App() {

    const sections = ["Work", 'About', 'Contact']

    const SKILLS = ['TypeScript', 'React', 'Tailwind', 'Google Cloud']

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
          <CustomHR />
          <ProjectCarousel />
          <div className='text-[45px] mt-44'>About Me</div>
          <CustomHR />
          <div className='flex flex-row'>
              <div className='w-1/2 text-[30px]'>
                  I'm a full-stack software developer with five years of experience designing solutions for
                  problems.
              </div>
              <div className='w-1/2'>
                  <ResumeAccordion />
              </div>
          </div>
          <div className='flex flex-row mt-44 justify-center gap-x-4 items-center'>
              {SKILLS.map((skill, index)=>{
                  return (
                      <>
                      <div className='text-[24px]'>{skill}</div>
                  {index < SKILLS.length - 1 && <Circle className="text-[#282828]" sx={{fontSize: '6px'}} />
                  }
                      </>
              )

              })}
          </div>
          <div className='text-[45px] mt-44'>Contact</div>
          <CustomHR />
          <div className="flex flex-row">
              <div className='w-1/2 text-[30px]'>If you're interested in hiring me, please reach out.</div>
              <div className='w-1/2'>
                  <ContactForm />
              </div>
          </div>
      </div>
    </>
  )
}

export default App
