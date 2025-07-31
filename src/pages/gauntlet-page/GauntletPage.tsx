import { Backspace, Circle, Shuffle } from "@mui/icons-material";
import { useEffect, useState } from "react";
import dictionary from "../../assets/12dicts-6.0.2/American/2of12.txt?raw";
import { Alert, LinearProgress, Snackbar } from "@mui/material";
import { motion } from "framer-motion";

/**
 * Maximum length for words in the game
 */
const MAX_WORD_LENGTH = 20;

/**
 * Letter point values for scoring
 */
const LETTER_POINTS: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1,
  m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8,
  y: 4, z: 10,
};

/**
 * Generate random letters with a balanced mix of vowels and consonants
 * @param count - Number of letters to generate (default: 9)
 * @returns Array of random letters
 */
function generateRandomLetters(count = 9): string[] {
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const vowels = "aeiou";
  const result: string[] = [];

  const numVowels = Math.round(count * 0.4);
  const numConsonants = count - numVowels;

  // Add consonants
  for (let i = 0; i < numConsonants; i++) {
    const randomLetter = consonants[Math.floor(Math.random() * consonants.length)];
    result.push(randomLetter);
    consonants.replace(randomLetter, "");
  }

  // Add vowels
  for (let i = 0; i < numVowels; i++) {
    const randomLetter = vowels[Math.floor(Math.random() * vowels.length)];
    result.push(randomLetter);
    vowels.replace(randomLetter, "");
  }

  return result;
}

/**
 * Calculate the score for a given word
 * @param word - The word to score
 * @returns The total score
 */
const calculateWordScore = (word: string): number => {
  return word
    .split("")
    .reduce((total, letter) => total + LETTER_POINTS[letter], 0);
};

/**
 * Get valid answers for the current letters and round
 * @param letters - Available letters
 * @param round - Current round number
 * @returns Object containing valid answers and threshold score
 */
const getValidAnswers = (letters: string[], round: number) => {
  const wordList: string[] = dictionary.replace(/\r/g, "").split("\n");
  const validWords = wordList.filter((word) => word.length > 2);

  const validAnswers = validWords.filter((word) => {
    return word
      .split("")
      .every((letterInWord) => letters.includes(letterInWord));
  });

  const scoredAnswers = validAnswers.map((word) => ({
    word,
    score: calculateWordScore(word),
  }));

  scoredAnswers.sort((a, b) => b.score - a.score);

  // Difficulty increases with each round
  const difficulties = [0.7, 0.55, 0.4, 0.25, 0.1];
  const thresholdIndex = Math.floor(scoredAnswers.length * difficulties[round]);
  const thresholdScore = scoredAnswers[thresholdIndex]?.score || 0;
  
  return {
    answers: scoredAnswers
      .filter((answer) => answer.score >= thresholdScore)
      .map((answer) => answer.word),
    thresholdScore,
  };
};

/**
 * Main Gauntlet game component
 */
export const GauntletPage = () => {
  const [availableLetters, setAvailableLetters] = useState<string[]>(generateRandomLetters());
  const [currentWord, setCurrentWord] = useState<string>("");
  const [validAnswers, setValidAnswers] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);
  const [thresholdScore, setThresholdScore] = useState<number>(0);
  const [alertMessage, setAlertMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [lastAddedLetter, setLastAddedLetter] = useState<string | null>(null);

  // Handle keyboard input for letter selection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (availableLetters.includes(event.key) && currentWord.length < MAX_WORD_LENGTH) {
        setLastAddedLetter(key);
        // Clear the animation after a short delay
        setTimeout(() => setLastAddedLetter(null), 150);
      }
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
  }, [activeKeys, availableLetters, currentWord]);

  /**
   * Shuffle the available letters
   */
  const shuffleLetters = () => {
    const shuffledLetters = [...availableLetters];
    for (let i = shuffledLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
    }
    setAvailableLetters(shuffledLetters);
  };

  // Update valid answers when letters change
  useEffect(() => {
    const result = getValidAnswers(availableLetters, currentRound);
    setValidAnswers(result.answers);
    setThresholdScore(result.thresholdScore);
  }, [availableLetters, currentRound]);

  const currentScore = calculateWordScore(currentWord);
  const isScoreTooLow = currentScore < thresholdScore;

  /**
   * Submit the current word as an answer
   */
  const submitAnswer = () => {
    if (isScoreTooLow) return;
    
    const isAnswerValid = validAnswers.includes(currentWord);
    
    if (isAnswerValid) {
      if (currentRound === 4) {
        setHasWon(true);
      } else {
        setCurrentRound(currentRound + 1);
        setAvailableLetters(generateRandomLetters());
        setCurrentWord("");
        setRemainingAttempts(3); // Reset attempts for new round
        setAlertMessage({ type: "success", text: "Nice one!" });
      }
    } else {
      setCurrentWord("");
      const newAttempts = remainingAttempts - 1;
      setRemainingAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        setHasLost(true);
        setAlertMessage({ type: "error", text: "Game Over! You ran out of attempts." });
      } else {
        setAlertMessage({ type: "error", text: `Not a valid word! ${newAttempts} attempts remaining.` });
      }
    }
  };

  // Handle keyboard input for word building and submission
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (availableLetters.includes(event.key) && currentWord.length < MAX_WORD_LENGTH) {
        setCurrentWord(currentWord + event.key);
      }

      if (event.key === "Backspace") {
        setCurrentWord(currentWord.slice(0, -1));
      }

      if (event.key === "Enter") {
        submitAnswer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [availableLetters, currentWord]);

  const progressPercentage = Math.min((currentScore / thresholdScore) * 100, 100);

  /**
   * Reset the game to start over
   */
  const resetGame = () => {
    setCurrentRound(0);
    setAvailableLetters(generateRandomLetters());
    setCurrentWord("");
    setRemainingAttempts(3);
    setHasWon(false);
    setHasLost(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800"
         style={{ fontFamily: "Neue Haas Grotesk" }}>
      
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={3000}
        onClose={() => setAlertMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertMessage?.type} onClose={() => setAlertMessage(null)}>
          {alertMessage?.text}
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
          {hasWon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="text-4xl font-light text-emerald-600">You won!</div>
              <p className="text-slate-600">Congratulations on completing the gauntlet!</p>
            </motion.div>
          )}

          {/* Lose State */}
          {hasLost && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="text-4xl font-light text-red-600">Game Over!</div>
              <p className="text-slate-600">You ran out of attempts. Try again!</p>
              <motion.button
                onClick={resetGame}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </motion.div>
          )}

          {/* Game Interface */}
          {!hasWon && !hasLost && (
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
                        roundNumber <= currentRound 
                          ? "text-blue-500 fill-current" 
                          : "text-slate-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Attempts Counter */}
              <div className="text-center space-y-2">
                <div className="text-sm text-slate-500 mb-2">Attempts</div>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3].map((attemptNumber) => (
                    <motion.div
                      key={attemptNumber}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: attemptNumber * 0.1 }}
                    >
                      <Circle
                        className={`w-4 h-4 transition-colors duration-300 ${
                          attemptNumber <= remainingAttempts 
                            ? "text-green-500 fill-current" 
                            : "text-red-400 fill-current"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Current Word Display */}
              <motion.div 
                className="min-h-[4rem] flex items-center justify-center"
                layout
              >
                <div className="text-6xl font-light tracking-wider text-slate-900">
                  {currentWord || "..."}
                </div>
              </motion.div>

              {/* Letter Grid */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-lg mx-auto">
                {availableLetters.map((letter, index) => (
                  <motion.button
                    key={index}
                    className="relative aspect-square rounded-xl text-xl font-medium transition-all duration-200 hover:shadow-lg"
                    onClick={() => {
                      if (currentWord.length < MAX_WORD_LENGTH) {
                        setCurrentWord(currentWord + letter);
                      }
                    }}
                    animate={{
                      scale: (activeKeys.includes(letter.toLowerCase()) || lastAddedLetter === letter.toLowerCase()) ? 1.05 : 1,
                      backgroundColor: (activeKeys.includes(letter.toLowerCase()) || lastAddedLetter === letter.toLowerCase())
                        ? "#fde68a"
                        : "#fef3c7",
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "#fde68a"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      duration: 0.1,
                      ease: "easeOut"
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
                  onClick={() => setCurrentWord(currentWord.slice(0, -1))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Backspace className="text-slate-600" />
                </motion.button>

                <motion.button
                  onClick={submitAnswer}
                  className="relative flex-1 h-14 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  disabled={isScoreTooLow}
                  whileHover={{ scale: isScoreTooLow ? 1 : 1.02 }}
                  whileTap={{ scale: isScoreTooLow ? 1 : 0.98 }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{
                      height: 56,
                      borderRadius: "24px",
                      backgroundColor: isScoreTooLow ? "#e2e8f0" : "#dbeafe",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: isScoreTooLow ? "#94a3b8" : "#3b82f6",
                        borderRadius: "24px",
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
                  onClick={shuffleLetters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shuffle className="text-slate-600" />
                </motion.button>
              </div>

              {/* Score Indicator */}
              <div className="text-center space-y-2">
                <div className="text-sm text-slate-500">
                  Current Score: <span className="font-medium text-slate-700">{currentScore}</span>
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
