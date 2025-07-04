import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/landing-page/LandingPage.tsx";
import { GauntletPage } from "./pages/gauntlet-page/GauntletPage.tsx";
import { SamplerPage } from "./pages/sampler-page/SamplerPage.tsx";
import DataChatPage from "./pages/datachat-page/DataChatPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gauntlet" element={<GauntletPage />} />
        <Route path="/sampler" element={<SamplerPage />} />
        <Route path="/data-chat" element={<DataChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
