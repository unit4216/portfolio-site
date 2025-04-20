import './App.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {  Circle, KeyboardArrowDown} from '@mui/icons-material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { TextField} from "@mui/material";
import { motion } from 'framer-motion';




export function MasonryGrid() {
    const items = [
        { id: 1, text: 'project1', height: 'h-32', img: null },
        { id: 2, text: 'project2', height: 'h-96', img: null },
        { id: 3, text: 'project3', height: 'h-80', img: null },
        { id: 4,
            text: 'Cancer Detection',
            height: 'h-48',
            img: './src/assets/cancer-detection.png',
            url: 'https://github.com/unit4216/cancer-cnn/blob/main/cnn-cancer-detection.ipynb'
        },
    ];

    return (
        <div className="columns-2 gap-4 p-4">
            {items.map(item => (
                <a href={item.url}  target="_blank" className="block mb-4"
                >
                    <motion.div
                        key={item.id}
                        className={`break-inside-avoid rounded-lg bg-white p-4 shadow-md border-none ${item.height}`}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        style={{
                            backgroundImage: item.img ? `url(${item.img})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div className='flex flex-col justify-end h-full'>
                        {item.text}
                        </div>
                    </motion.div>
                </a>
            ))}
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
    return <hr className='border-t-[1px] text-[#282828] border-[#282828]'/>
}

const StyledTextField = ({rows=1, placeholder}: {rows?: number, placeholder: string}) =>{
    return (
        <TextField
            rows={rows}
            multiline
            fullWidth
            placeholder={placeholder}
            sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                '& fieldset': {
                    borderWidth: '2px',
                    borderColor: '#282828',
                },
                '&:hover fieldset': {
                    borderColor: '#282828',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#282828',
                },
            },
        }}/>
    )
}

export const ContactForm = () => {
    return (
        <div className='flex flex-col gap-y-4'>
            <div className="flex flex-row gap-x-4">
                <StyledTextField placeholder={"First Name"}/>
                <StyledTextField placeholder={"Last Name"}/>
            </div>
            <StyledTextField placeholder={"Email"}/>
            <StyledTextField placeholder={"Enter message"} rows={5}/>
            <button className='rounded-none border-[2px] border-[#282828] w-22 h-9'>Send</button>
        </div>
    )
}

const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        console.log('test')
    }
};

function App() {

    const sections = ["Work", 'About', 'Contact']

    const SKILLS = ['TypeScript', 'React', 'Tailwind', 'Google Cloud']

  return (

      <div
          className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
          style={{fontFamily: 'Neue Haas Grotesk'}}
      >
          <div className="fixed z-50 top-0 left-0 w-full bg-[#F5F5F5] px-40 py-4">
              <div className="flex flex-row justify-end gap-x-10 text-[25px]">
                  {sections.map(section=>{
                      return (
                          <button
                              onClick={() => scrollTo(section)}
                          >
                          {section}
                      </button>)
                  })}
              </div>
          </div>
          <section className='h-screen'>
              <div className='text-[200px] w-1/3'>
                  pablo
              </div>
              <div className='text-[200px] w-2/3 text-right'>
                  paliza
              </div>
              <div className='text-[200px] w-full flex flex-row justify-between items-center'>
                  <div className='text-[25px]'>*Full stack software engineer</div>

                  <div>carre*</div>
              </div>
          </section>
          <section className=' scroll-mt-16' id={'Work'}>
              <div className='text-[45px] mt-44'>Projects</div>
              <CustomHR />
              <div className='mt-10'>
                <MasonryGrid />
              </div>
          </section>
          <section className='scroll-mt-16' id={'About'}>
              <div className='text-[45px] mt-44'>About Me</div>
              <CustomHR />
              <div className='mt-24'/>
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
          </section>
          <section className='scroll-mt-16' id={'Contact'}>
              <div className='text-[45px] mt-44'>Contact</div>
              <CustomHR />
              <div className='mt-24'/>
              <div className="flex flex-row mb-32">
                  <div className='w-1/2 text-[30px]'>If you're interested in hiring me, please reach out.</div>
                  <div className='w-1/2'>
                      <ContactForm />
                  </div>
              </div>
            </section>
          <CustomHR />
          <div className='mt-10'/>
          <div className='flex flex-row items-center justify-between'>
              <div className={'text-[#6B7280] text-[14px]'}>&copy; 2025 Pablo Paliza.  All rights reserved.</div>
              <div className='flex flex-row items-center gap-x-2'>
                  <a
                      href="https://www.linkedin.com/in/pablo-paliza-carre-029676134/"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      <img src={"./src/assets/linkedin-icon.png"} className='h-6'/>
                  </a>
                  <a
                      href="https://www.github.com/unit4216"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      <img src={"./src/assets/github-icon.png"} className='h-6'/>
                  </a>
              </div>
          </div>
      </div>

  )
}

export default App
