import './App.css'

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
          <div className='text-[25px]'>Full stack developer + problem solver</div>
          <div className='text-[45px] mt-44'>Projects</div>
          <hr />
      </div>
    </>
  )
}

export default App
