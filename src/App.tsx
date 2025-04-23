import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {LandingPage} from "./pages/landing-page/LandingPage.tsx";
import {WordGamePage} from "./pages/word-game/WordGamePage.tsx";


function App() {

  return (
      <Router>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/word-game" element={<WordGamePage />} />
          </Routes>
      </Router>
  )
}

export default App
