import {Backspace, Clear, Shuffle} from "@mui/icons-material";
import {useEffect, useState} from "react";
import dictionary from '../../assets/12dicts-6.0.2/American/2of12.txt?raw'

const LETTER_POINTS = {
    a: 1,
    b: 2,
    c: 3,
    d: 2,
    e: 1,
    f: 4,
    g: 2,
    h: 4,
    i: 1,
    j: 8,
    k: 5,
    l: 1,
    m: 3,
    n: 1,
    o: 1,
    p: 3,
    q: 10,
    r: 1,
    s: 1,
    t: 1,
    u: 1,
    v: 4,
    w: 4,
    x: 8,
    y: 4,
    z: 10
}

function getRandomLetters(count = 9): string[] {
    let consonants = 'bcdfghjklmnpqrstvwxyz';
    let vowels = 'aeiou'
    const result: string[] = [];

    const numVowels = Math.round(count * 0.4);
    const numConsonants = count - numVowels;

    for (let i = 0; i < numConsonants; i++) {
        const randomLetter = consonants[Math.floor(Math.random() * consonants.length)];
        result.push(randomLetter);
        consonants = consonants.replace(randomLetter,'')
    }

    for (let i = 0; i < numVowels; i++) {
        const randomLetter = vowels[Math.floor(Math.random() * vowels.length)];
        result.push(randomLetter);
        vowels = vowels.replace(randomLetter, '')
    }

    return result;
}

const getWordScore = (word: string) => {
    return word.split('').reduce(
        (acc, letter)=>acc += LETTER_POINTS[letter], 0
    )
}

const getAnswerList = (letters: string[]) => {
    const wordList: string[] = dictionary.replaceAll('\r','').split('\n')
    const validWords = wordList.filter(word=>word.length > 2)

    // todo introduce difficulty based on round
    const validAnswers = validWords.filter(word=>{

        return word.split('').every(letterInWord=>letters.includes(letterInWord))

    })

    const scoredAnswers = validAnswers.map(word => ({
        word,
        score: getWordScore(word)
    }));

    scoredAnswers.sort((a, b) => b.score - a.score);

    const thresholdIndex = Math.floor(scoredAnswers.length * 0.50);
    const topAnswers = scoredAnswers.slice(0, thresholdIndex);
    return {
        answers: topAnswers.map(({word})=>word),
        thresholdScore: topAnswers.slice(-1)[0].score
    }
}





export const GauntletPage = function () {

    const [letters, setLetters] = useState<string[]>(getRandomLetters())
    const [sequence, setSequence] = useState<string>('')
    const [answerList, setAnswerList] = useState<string[]>([])
    const [round, setRound] = useState<number>(1)
    const [won, setWon] = useState<boolean>(false)
    const [thresholdScore, setThresholdScore] = useState<number>(0)


    function shuffleSequence() {
        const lettersRef = [...letters]
        for (let i = lettersRef.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lettersRef[i], lettersRef[j]] = [lettersRef[j], lettersRef[i]];
        }
        setLetters(lettersRef)
    }

    useEffect(()=>{
        const res = getAnswerList(letters)
        setAnswerList(res.answers)
        setThresholdScore(res.thresholdScore)
    },[letters])

    const score = getWordScore(sequence)


    const submitAnswer = () => {
        const answerIsValid = answerList.includes(sequence)
        const scoreMeetsThreshold = score >= thresholdScore
        if (answerIsValid && scoreMeetsThreshold) {
            if (round == 5) {
                setWon(true)
            }
            else {
                setRound(round + 1)
                setLetters(getRandomLetters())
                setSequence('')
            }
        }
        else {
            setSequence('')
        }
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {

            if (letters.includes(event.key)) {
                setSequence(sequence + event.key)
            }

            if (event.key === 'Backspace') {
                setSequence(sequence.slice(0,-1))
            }

            if (event.key === 'Enter') {
                submitAnswer()
            }

        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [letters, sequence]);

    return (
        <div
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
            <div className='flex flex-row justify-center'>
                <div className='flex flex-col gap-y-4'>
                    <div>GAUNTLET</div>
                    {won && (
                        <div>You won!</div>
                    )}
                    {!won && (
                        <>
                            <div>Round {round}</div>
                            <div>Score {score}</div>
                            <div>Threshold {thresholdScore}</div>
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
                                            {letter} ({LETTER_POINTS[letter]})
                                        </button>
                                    )
                                })}
                            </div>
                            <button onClick={submitAnswer}>Submit</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}