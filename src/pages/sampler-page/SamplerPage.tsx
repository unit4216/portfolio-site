import cowbell from '../../assets/808-samples/Roland TR-808/CB/CB.wav'
import bass from '../../assets/808-samples/Roland TR-808/BD/BD0000.wav'
import snare from '../../assets/808-samples/Roland TR-808/SD/SD0010.wav'
import closedHat from '../../assets/808-samples/Roland TR-808/CH/CH.wav'
import hiTom from '../../assets/808-samples/Roland TR-808/HT/HT00.wav'
import cymbal from '../../assets/808-samples/Roland TR-808/CY/CY0000.wav'
import clap from '../../assets/808-samples/Roland TR-808/CP/CP.wav'
import openHat from '../../assets/808-samples/Roland TR-808/OH/OH00.wav'

import {useEffect, useRef, useState} from "react";
import { Howl } from 'howler';
import metronomeClick from '../../assets/808-samples/Roland TR-808/RS/RS.wav'
import { PlayArrow, Stop } from '@mui/icons-material'
import { motion } from "framer-motion";


const SAMPLES = [
    {src: cowbell, key: 'q'},
    {src: bass, key: 'w'},
    {src: snare, key: 'e'},
    {src: closedHat, key: 'r'},
    {src: hiTom, key: 'a'},
    {src: cymbal, key: 's'},
    {src: clap, key: 'd'},
    {src: openHat, key: 'f'}
]


export const Metronome = function () {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120); // default BPM
    const intervalId = useRef<NodeJS.Timeout | null>(null);
    const dragging = useRef(false);
    const startY = useRef(0);
    const startBpm = useRef(120);

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
    };

    const stopMetronome = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }
    };

    const toggleMetronome = () => {
        if (isPlaying) {
            stopMetronome();
            setIsPlaying(false);
        } else {
            startMetronome();
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            stopMetronome();
            startMetronome();
        }
    }, [bpm]);

    const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
        dragging.current = true;
        startY.current = e.clientY;
        startBpm.current = bpm;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging.current) {
            const deltaY = startY.current - e.clientY;
            const sensitivity = 0.5; // adjust how fast BPM changes

            let newBpm = startBpm.current + deltaY * sensitivity;
            newBpm = Math.max(30, Math.min(300, newBpm)); // clamp BPM 30-300
            setBpm(Math.round(newBpm));
        }
    };

    const handleMouseUp = () => {
        dragging.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="flex flex-row items-center gap-4">
            <button
                onClick={toggleMetronome}
            >
                {isPlaying ? <Stop /> : <PlayArrow />}
            </button>
            <input
                type="text"
                value={bpm}
                readOnly
                onMouseDown={handleMouseDown}
                className="text-4xl w-24 text-center border border-gray-300 rounded-lg p-2 cursor-ns-resize select-none"
            />
            <div className="text-lg">BPM</div>
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
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5] flex flex-col items-center gap-y-8'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
            <Metronome />
            <div className='grid grid-cols-4 w-fit gap-4 mx-auto'>
                {SAMPLES.map(sample=>{
                    return (
                        <motion.button
                            className={`relative bg-gray-200 hover:bg-gray-300 rounded-lg h-44 w-44`}
                            onClick={() => {
                                howls[sample.key]?.play();
                            }}
                            // todo this should animate on mouse click as well...
                            animate={{
                                scale: activeKeys.includes(sample.key) ? 1.1 : 1,
                                backgroundColor: activeKeys.includes(sample.key) ? "#d1d5db" : "#e5e7eb",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                backgroundColor: { duration: 0.2 },
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}