import {Backspace, Clear, Shuffle} from "@mui/icons-material";
import { useState} from "react";
import dictionary from '../../assets/12dicts-6.0.2/American/2of12.txt?raw'

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

const getAnswerList = () => {
    const wordList: string[] = dictionary.replaceAll('\r','').split('\n')
    const validWords = wordList.filter(word=>word.length > 2)
    return validWords
}





export const WordGamePage = function () {

    const [letters, setLetters] = useState<string[]>(getRandomLetters())
    const [sequence, setSequence] = useState<string>('')


    function shuffleSequence() {
        const lettersRef = [...letters]
        for (let i = lettersRef.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lettersRef[i], lettersRef[j]] = [lettersRef[j], lettersRef[i]];
        }
        setLetters(lettersRef)
    }

    console.log(getAnswerList())

    return (
        <div
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
            <div className='flex flex-row justify-center'>
                <div className='flex flex-col gap-y-4'>
                    <div className='flex flex-row justify-between'>
                        <button
                            className='rounded-full'
                            onClick={() => setSequence(sequence.slice(0,-1))}>
                            <Backspace />
                        </button>
                        <div className='text-4xl'>{sequence}</div>
                        <button
                            className='rounded-full'
                            onClick={shuffleSequence}>
                            <Shuffle />
                        </button>
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