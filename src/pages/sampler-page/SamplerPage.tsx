import cowbell from '../../assets/808-samples/Roland TR-808/CB/CB.wav'
import bass from '../../assets/808-samples/Roland TR-808/BD/BD0000.wav'
import snare from '../../assets/808-samples/Roland TR-808/SD/SD0010.wav'
import closedHat from '../../assets/808-samples/Roland TR-808/CH/CH.wav'
import {useEffect, useRef} from "react";


const SAMPLES = [
    {src: cowbell, key: 'W'},
    {src: bass, key: 'A'},
    {src: snare, key: 'S'},
    {src: closedHat, key: 'D'}
]

export const SamplerPage = function () {
    const audioMap = useRef<Record<string, HTMLAudioElement>>({});

    const playSound = (key: string) => {
        const audio = audioMap.current[key.toLowerCase()];
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    useEffect(() => {

        SAMPLES.forEach(sample => {
            const audio = new Audio(sample.src);
            audio.load();
            audioMap.current[sample.key.toLowerCase()] = audio;
        });

        const handleKeyDown = (event: KeyboardEvent) => {

            playSound(event.key)

        };

        window.addEventListener('keydown', handleKeyDown);

        return () => { window.removeEventListener('keydown', handleKeyDown);   };
    }, []);

    return (
        <div
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
            <div className='grid grid-cols-4 gap-1'>
                {SAMPLES.map(sample=>{
                    return (
                        <button
                            className='relative bg-gray-200 hover:bg-gray-300 rounded-lg h-44 w-44'
                            onClick={() => {
                                playSound(sample.key)
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}