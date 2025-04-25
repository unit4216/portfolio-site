import cowbell from '../../assets/808-samples/Roland TR-808/CB/CB.wav'
import bass from '../../assets/808-samples/Roland TR-808/BD/BD0000.wav'
import snare from '../../assets/808-samples/Roland TR-808/SD/SD0010.wav'
import closedHat from '../../assets/808-samples/Roland TR-808/CH/CH.wav'
import {useEffect, useRef, useState} from "react";
import { Howl } from 'howler';
import metronomeClick from '../../assets/808-samples/Roland TR-808/RS/RS.wav'


const SAMPLES = [
    {src: cowbell, key: 'w'},
    {src: bass, key: 'a'},
    {src: snare, key: 's'},
    {src: closedHat, key: 'd'}
]



export const Metronome = function () {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120); // default BPM
    const intervalId = useRef<NodeJS.Timeout | null>(null);

    const click = useRef(
        new Howl({
            src: [metronomeClick],
            preload: true,
        })
    );

    const startMetronome = () => {
        const interval = (60 / bpm) * 1000;

        intervalId.current = setInterval(() => {
            click.current.play();
        }, interval);

        setIsPlaying(true);
    };

    const stopMetronome = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }
        setIsPlaying(false);
    };

    const toggleMetronome = () => {
        if (isPlaying) {
            stopMetronome();
        } else {
            startMetronome();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <input
                type="range"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
            />
            <div className="text-lg">{bpm} BPM</div>
            <button
                onClick={toggleMetronome}
            >
                {isPlaying ? 'Stop' : 'Start'}
            </button>
        </div>
    );
};


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
            <Metronome />
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