import sound from '../../assets/808-samples/Roland TR-808/CB/CB.wav'


const SAMPLES = [
    {src: sound}
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