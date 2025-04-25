import cowbell from '../../assets/808-samples/Roland TR-808/CB/CB.wav'
import bass from '../../assets/808-samples/Roland TR-808/BD/BD0000.wav'
import snare from '../../assets/808-samples/Roland TR-808/SD/SD0010.wav'
import closedHat from '../../assets/808-samples/Roland TR-808/CH/CH.wav'
import {useEffect, useState} from "react";
import { Howl } from 'howler';


const SAMPLES = [
    {src: cowbell, key: 'w'},
    {src: bass, key: 'a'},
    {src: snare, key: 's'},
    {src: closedHat, key: 'd'}
]

export const SamplerPage = function () {
    const [howls, setHowls] = useState<Record<string, Howl>>({});
    const [activeKeys, setActiveKeys] = useState<string[]>([])

    useEffect(() => {

        const loadedHowls: Record<string, Howl> = {};

        SAMPLES.forEach(sample => {
            loadedHowls[sample.key] = new Howl({
                src: [sample.src],
                preload: true,
                html5: false,
            })
        })

        setHowls(loadedHowls);


        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (loadedHowls[key]) {
                loadedHowls[key].play();
                setActiveKeys(prev => {
                    if (!prev.includes(key)) return [...prev, key];
                    return prev;
                });
            }
        };


        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            setActiveKeys(prev => prev.filter(k => k !== key));
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
                                howls[sample.key]?.play();
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}