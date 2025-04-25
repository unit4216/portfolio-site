import {Backspace, Circle, Clear, Shuffle} from "@mui/icons-material";
import {useEffect, useState} from "react";
import dictionary from '../../assets/12dicts-6.0.2/American/2of12.txt?raw'
import {Alert, LinearProgress, Snackbar} from "@mui/material";

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

const getAnswerList = (letters: string[], round: number) => {
    const wordList: string[] = dictionary.replaceAll('\r','').split('\n')
    const validWords = wordList.filter(word=>word.length > 2)

    const validAnswers = validWords.filter(word=>{

        return word.split('').every(letterInWord=>letters.includes(letterInWord))

    })

    const scoredAnswers = validAnswers.map(word => ({
        word,
        score: getWordScore(word)
    }));

    scoredAnswers.sort((a, b) => b.score - a.score);

    const difficulties = [0.9, 0.7, 0.5, 0.3, 0.1]

    const thresholdIndex = Math.floor(scoredAnswers.length * difficulties[round]);
    const topAnswersScoreThreshold = scoredAnswers[thresholdIndex].score
    return {
        answers: scoredAnswers
            .filter(answer=>answer.score >= topAnswersScoreThreshold)
            .map(answer=>answer.word),
        thresholdScore: topAnswersScoreThreshold
    }
}





export const GauntletPage = function () {

    const [letters, setLetters] = useState<string[]>(getRandomLetters())
    const [sequence, setSequence] = useState<string>('')
    const [answerList, setAnswerList] = useState<string[]>([])
    const [round, setRound] = useState<number>(0)
    const [won, setWon] = useState<boolean>(false)
    const [thresholdScore, setThresholdScore] = useState<number>(0)
    const [showAlert, setShowAlert] = useState<{type: 'error' | 'success', text: string} | null>(null)


    function shuffleSequence() {
        const lettersRef = [...letters]
        for (let i = lettersRef.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lettersRef[i], lettersRef[j]] = [lettersRef[j], lettersRef[i]];
        }
        setLetters(lettersRef)
    }

    useEffect(()=>{
        const res = getAnswerList(letters, round)
        setAnswerList(res.answers)
        setThresholdScore(res.thresholdScore)
    },[letters])

    const score = getWordScore(sequence)

    const scoreTooLow = score < thresholdScore

    const submitAnswer = () => {
        if (scoreTooLow) return
        const answerInAnswerSet = answerList.includes(sequence)
        if (answerInAnswerSet) {
            if (round == 4) {
                setWon(true)
            }
            else {
                setRound(round + 1)
                setLetters(getRandomLetters())
                setSequence('')
                setShowAlert({type: 'success', text: 'Nice one!'})
            }
        }
        else {
            setSequence('')
            setShowAlert({type: 'error', text: 'Not a valid word!'})
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

    const progress = Math.min((score/thresholdScore) * 100, 100)

    return (
        <div
            className='text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]'
            style={{fontFamily: 'Neue Haas Grotesk'}}
        >
                <Snackbar
                    open={!!showAlert}
                    autoHideDuration={3000}
                    onClose={() => setShowAlert(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity={showAlert?.type} onClose={() => setShowAlert(null)}>
                        {showAlert?.text}
                    </Alert>
                </Snackbar>
            <div className='flex flex-row justify-center'>
                <div className='flex flex-col gap-y-4'>
                    <div className='text-4xl text-center'>gauntlet</div>
                    {won && (
                        <div>You won!</div>
                    )}
                    {!won && (
                        <>
                            <div className='flex flex-row justify-between'>
                                {[0,1,2,3,4].map(roundNumber=>{
                                    return (
                                        <Circle
                                            className={`${roundNumber <= round ? 'text-blue-400': 'text-gray-200'}`}
                                        />
                                    )
                                })}
                            </div>
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
                            <div className='grid grid-cols-3 gap-2'>
                                {letters.map(letter=>{
                                    return (
                                        <button
                                            className='relative bg-amber-200 hover:bg-amber-300 rounded-lg px-10 py-8 text-4xl'
                                            onClick={() => setSequence(sequence + letter)}
                                        >
                                            {letter}
                                            <span className="absolute bottom-2 right-2 text-xs">
                                                {LETTER_POINTS[letter]}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={submitAnswer}
                                className='relative'
                                disabled={scoreTooLow}
                            >
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{ height: 50, borderRadius: 5 }}
                                />
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                                    Submit
                                </div>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}