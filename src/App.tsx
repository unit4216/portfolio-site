import './App.css'

function App() {

    const sections = ["Work", 'About', 'Contact']

  return (
    <>
      <div className='text-black font-haas'>
          <div className='flex flex-row gap-x-4 text-4xl'>
          {sections.map(section=>{
              return <div style={{fontFamily: 'Neue Haas Grotesk'}}>{section}</div>
          })}
          </div>
      </div>
    </>
  )
}

export default App
