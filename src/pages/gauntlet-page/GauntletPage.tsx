import { Backspace, Circle, Shuffle } from "@mui/icons-material";
import { useEffect, useState } from "react";
import dictionary from "../../assets/12dicts-6.0.2/American/2of12.txt?raw";
import { Alert, LinearProgress, Snackbar } from "@mui/material";
import { motion } from "framer-motion";

const LETTER_POINTS: Record<string, number> = {
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
  z: 10,
};

function getRandomLetters(count = 9): string[] {
  let consonants = "bcdfghjklmnpqrstvwxyz";
  let vowels = "aeiou";
  const result: string[] = [];

  const numVowels = Math.round(count * 0.4);
  const numConsonants = count - numVowels;

  for (let i = 0; i < numConsonants; i++) {
    const randomLetter =
      consonants[Math.floor(Math.random() * consonants.length)];
    result.push(randomLetter);
    consonants = consonants.replace(randomLetter, "");
  }

  for (let i = 0; i < numVowels; i++) {
    const randomLetter = vowels[Math.floor(Math.random() * vowels.length)];
    result.push(randomLetter);
    vowels = vowels.replace(randomLetter, "");
  }

  return result;
}

const getWordScore = (word: string) => {
  return word
    .split("")
    .reduce((acc, letter) => (acc += LETTER_POINTS[letter]), 0);
};

const getAnswerList = (letters: string[], round: number) => {
  const wordList: string[] = dictionary.replace(/\r/g, "").split("\n");
  const validWords = wordList.filter((word) => word.length > 2);

  const validAnswers = validWords.filter((word) => {
    return word
      .split("")
      .every((letterInWord) => letters.includes(letterInWord));
  });

  const scoredAnswers = validAnswers.map((word) => ({
    word,
    score: getWordScore(word),
  }));

  scoredAnswers.sort((a, b) => b.score - a.score);

  const difficulties = [0.7, 0.55, 0.4, 0.25, 0.1];

  const thresholdIndex = Math.floor(scoredAnswers.length * difficulties[round]);
  const topAnswersScoreThreshold = scoredAnswers[thresholdIndex].score;
  return {
    answers: scoredAnswers
      .filter((answer) => answer.score >= topAnswersScoreThreshold)
      .map((answer) => answer.word),
    thresholdScore: topAnswersScoreThreshold,
  };
};

export const GauntletPage = function () {
  const [letters, setLetters] = useState<string[]>(getRandomLetters());
  const [sequence, setSequence] = useState<string>("");
  const [answerList, setAnswerList] = useState<string[]>([]);
  const [round, setRound] = useState<number>(0);
  const [won, setWon] = useState<boolean>(false);
  const [thresholdScore, setThresholdScore] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setActiveKeys((prev) => {
        if (!prev.includes(key)) return [...prev, key];
        return prev;
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setActiveKeys((prev) => prev.filter((k) => k !== key));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeKeys]);

  function shuffleSequence() {
    const lettersRef = [...letters];
    for (let i = lettersRef.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lettersRef[i], lettersRef[j]] = [lettersRef[j], lettersRef[i]];
    }
    setLetters(lettersRef);
  }

  useEffect(() => {
    const res = getAnswerList(letters, round);
    setAnswerList(res.answers);
    setThresholdScore(res.thresholdScore);
  }, [letters]);

  const score = getWordScore(sequence);

  const scoreTooLow = score < thresholdScore;

  const submitAnswer = () => {
    if (scoreTooLow) return;
    const answerInAnswerSet = answerList.includes(sequence);
    if (answerInAnswerSet) {
      if (round == 4) {
        setWon(true);
      } else {
        setRound(round + 1);
        setLetters(getRandomLetters());
        setSequence("");
        setShowAlert({ type: "success", text: "Nice one!" });
      }
    } else {
      setSequence("");
      setShowAlert({ type: "error", text: "Not a valid word!" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (letters.includes(event.key)) {
        setSequence(sequence + event.key);
      }

      if (event.key === "Backspace") {
        setSequence(sequence.slice(0, -1));
      }

      if (event.key === "Enter") {
        submitAnswer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [letters, sequence]);

  const progress = Math.min((score / thresholdScore) * 100, 100);

  return (
    <div
      className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800"
      style={{ fontFamily: "Neue Haas Grotesk" }}
    >
      <Snackbar
        open={!!showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={showAlert?.type} onClose={() => setShowAlert(null)}>
          {showAlert?.text}
        </Alert>
      </Snackbar>
      
      <div className="w-full px-6 py-12">
        <div className="text-center space-y-8 w-full">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-5xl font-light tracking-tight text-slate-900">
              gauntlet
            </h1>
            <p className="text-slate-600 text-lg font-light">
              Form words from the letters below
            </p>
          </motion.div>

          {/* Win State */}
          {won && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="text-4xl font-light text-emerald-600">You won!</div>
              <p className="text-slate-600">Congratulations on completing the gauntlet!</p>
            </motion.div>
          )}

          {!won && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Progress Indicators */}
              <div className="flex justify-center space-x-3">
                {[0, 1, 2, 3, 4].map((roundNumber) => (
                  <motion.div
                    key={roundNumber}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: roundNumber * 0.1 }}
                  >
                    <Circle
                      className={`w-6 h-6 transition-colors duration-300 ${
                        roundNumber <= round 
                          ? "text-blue-500 fill-current" 
                          : "text-slate-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Current Word Display */}
              <motion.div 
                className="min-h-[4rem] flex items-center justify-center"
                layout
              >
                <div className="text-6xl font-light tracking-wider text-slate-900">
                  {sequence || "..."}
                </div>
              </motion.div>

              {/* Letter Grid */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-lg mx-auto">
                {letters.map((letter, index) => (
                  <motion.button
                    key={index}
                    className="relative aspect-square rounded-xl text-xl font-medium transition-all duration-200 hover:shadow-lg"
                    onClick={() => setSequence(sequence + letter)}
                    animate={{
                      scale: activeKeys.includes(letter.toLowerCase()) ? 1.05 : 1,
                      backgroundColor: activeKeys.includes(letter.toLowerCase())
                        ? "#fbbf24"
                        : "#fef3c7",
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "#fde68a"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <span className="text-slate-800">{letter}</span>
                    <span className="absolute bottom-1 right-1 text-xs font-medium text-slate-500">
                      {LETTER_POINTS[letter]}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-4 w-full max-w-2xl mx-auto">
                <motion.button
                  className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  onClick={() => setSequence(sequence.slice(0, -1))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Backspace className="text-slate-600" />
                </motion.button>

                <motion.button
                  onClick={submitAnswer}
                  className="relative flex-1 h-14 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  disabled={scoreTooLow}
                  whileHover={{ scale: scoreTooLow ? 1 : 1.02 }}
                  whileTap={{ scale: scoreTooLow ? 1 : 0.98 }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                                          sx={{
                        height: 56,
                        borderRadius: "16px",
                        backgroundColor: scoreTooLow ? "#e2e8f0" : "#dbeafe",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: scoreTooLow ? "#94a3b8" : "#3b82f6",
                          borderRadius: "16px",
                        },
                      }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      Submit
                    </span>
                  </div>
                </motion.button>

                <motion.button 
                  className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  onClick={shuffleSequence}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shuffle className="text-slate-600" />
                </motion.button>
              </div>

              {/* Score Indicator */}
              <div className="text-center space-y-2">
                <div className="text-sm text-slate-500">
                  Current Score: <span className="font-medium text-slate-700">{score}</span>
                </div>
                <div className="text-sm text-slate-500">
                  Target: <span className="font-medium text-slate-700">{thresholdScore}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
