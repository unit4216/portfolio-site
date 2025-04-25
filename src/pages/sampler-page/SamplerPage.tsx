import cowbell from '../../assets/808-samples/Roland TR-808/CB/CB.wav'
import bass from '../../assets/808-samples/Roland TR-808/BD/BD0000.wav'
import snare from '../../assets/808-samples/Roland TR-808/SD/SD0010.wav'
import closedHat from '../../assets/808-samples/Roland TR-808/CH/CH.wav'


const SAMPLES = [
    {src: cowbell},
    {src: bass},
    {src: snare},
    {src: closedHat}
]

export const SamplerPage = function () {

    return (
        <div
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
            <div className='grid grid-cols-3 gap-2'>
                {SAMPLES.map(sample=>{
                    return (
                        <button
                            className='relative bg-amber-200 hover:bg-amber-300 rounded-lg px-10 py-8 text-4xl'
                            onClick={() => {
                                new Audio(sample.src).play()
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}