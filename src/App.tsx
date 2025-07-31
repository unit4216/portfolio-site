import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/landing-page/LandingPage.tsx";
import { SamplerPage } from "./pages/sampler-page/SamplerPage.tsx";
import DataChatPage from "./pages/datachat-page/DataChatPage.tsx";
import { Analytics } from "@vercel/analytics/react"

/**
 * Main application component that handles routing between different pages
 */
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sampler" element={<SamplerPage />} />
          <Route path="/data-chat" element={<DataChatPage />} />
        </Routes>
      </Router>
      <Analytics />
    </>
  );
}

export default App;
