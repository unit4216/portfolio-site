import cowbell from '../../assets/808-samples/Roland TR-808/CB/CB.wav'
import bass from '../../assets/808-samples/Roland TR-808/BD/BD0000.wav'
import snare from '../../assets/808-samples/Roland TR-808/SD/SD0010.wav'
import closedHat from '../../assets/808-samples/Roland TR-808/CH/CH.wav'
import {useEffect, useState, useRef} from "react";


const SAMPLES = [
    {src: cowbell, key: 'w'},
    {src: bass, key: 'a'},
    {src: snare, key: 's'},
    {src: closedHat, key: 'd'}
]

export const SamplerPage = function () {
    const audioMap = useRef<Record<string, HTMLAudioElement>>({});
    const [activeKeys, setActiveKeys] = useState<string[]>([])

    const playSound = (key: string) => {
        const audio = audioMap.current[key.toLowerCase()];
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    // todo lag may be due to space at beginning of waveform
    useEffect(() => {

        SAMPLES.forEach(sample => {
            const audio = new Audio(sample.src);
            audio.load();
            audioMap.current[sample.key.toLowerCase()] = audio;
        });

        const handleKeyDown = (event: KeyboardEvent) => {

            playSound(event.key)
            if (!activeKeys.includes(event.key)) setActiveKeys([...activeKeys, event.key])

        };

        const handleKeyUp = (event: KeyboardEvent) => {
            setActiveKeys(activeKeys.filter(key=>key!==event.key))
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };

        }, [activeKeys]);

    return (
        <div
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
            <div className='grid grid-cols-4 gap-1'>
                {SAMPLES.map(sample=>{
                    return (
                        <button
                            className={`relative ${activeKeys.includes(sample.key) ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-300 
                            rounded-lg h-44 w-44`}
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