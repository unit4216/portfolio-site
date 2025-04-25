import cowbell from '../../assets/808-samples/Roland TR-808/CB/CB.wav'
import bass from '../../assets/808-samples/Roland TR-808/BD/BD0000.wav'
import snare from '../../assets/808-samples/Roland TR-808/SD/SD0010.wav'
import closedHat from '../../assets/808-samples/Roland TR-808/CH/CH.wav'
import {useEffect} from "react";


const SAMPLES = [
    {src: cowbell, key: 'W'},
    {src: bass, key: 'A'},
    {src: snare, key: 'S'},
    {src: closedHat, key: 'D'}
]

export const SamplerPage = function () {

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {

            const relevantSound = SAMPLES.find(sample=>sample.key.toLowerCase() === event.key)
            if (relevantSound) {
                new Audio(relevantSound.src).play()
            }

        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
            <div className='grid grid-cols-4 gap-2'>
                {SAMPLES.map(sample=>{
                    return (
                        <button
                            className='relative bg-gray-200 hover:bg-gray-300 rounded-lg px-10 py-8 text-4xl'
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