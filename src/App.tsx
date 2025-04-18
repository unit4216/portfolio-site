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
              <div className='flex flex-row gap-x-4 text-2xl'>
                  {sections.map(section=>{
                      return <div>{section}</div>
                  })}
              </div>
          </div>
          <div className='text-6xl mt-44'>
              Pablo Paliza
          </div>
          <div className='text-xl'>Full stack developer + problem solver</div>
          <div className='text-4xl'>Projects</div>
      </div>
    </>
  )
}

export default App
