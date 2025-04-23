import {Backspace, Clear} from "@mui/icons-material";
import { useState} from "react";

function getRandomLetters(count = 9): string[] {
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    const vowels = 'AEIOU'
    const result: string[] = [];

    const numVowels = Math.round(count * 0.4);
    const numConsonants = count - numVowels;

    for (let i = 0; i < numConsonants; i++) {
        const randomLetter = consonants[Math.floor(Math.random() * consonants.length)];
        result.push(randomLetter);
    }

    for (let i = 0; i < numVowels; i++) {
        const randomLetter = vowels[Math.floor(Math.random() * vowels.length)];
        result.push(randomLetter);
    }

    return result;
}





export const WordGamePage = function () {

    const [letters, setLetters] = useState<string[]>(getRandomLetters())
    const [sequence, setSequence] = useState<string>('')




    return (
        <div
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
            <div className='flex flex-row justify-center'>
                <div className='flex flex-col gap-y-4'>
                    <div className='flex flex-row gap-x-4'>
                        <button
                            className='rounded-full'
                            onClick={() => setSequence(sequence.slice(0,-1))}>
                            <Backspace />
                        </button>
                        <div className='text-4xl'>{sequence}</div>
                    </div>
                    <div className='grid grid-cols-3 gap-4'>
                    {letters.map(letter=>{

                        return (
                            <button
                                className='bg-amber-200 hover:bg-amber-300 rounded-lg p-10 text-4xl'
                                onClick={() => setSequence(sequence + letter)}
                            >
                                {letter}
                            </button>
                        )
                    })}
                    </div>
                </div>
            </div>
        </div>
    )
}