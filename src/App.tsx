import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import { useLiveViewers } from "./hooks/useLiveViewers";
import "./App.css";

const StatsWidget = () => {
  const { liveCount, totalVisits, topCountries } = useLiveViewers();

  if (liveCount === null) return null;

  return (
    <div className="stats-badge">
      <span className="stats-label">stats:</span>
      <span className="dot red" />
      <span>{liveCount} live</span>
      {totalVisits !== null && (
        <>
          <span className="stats-divider">•</span>
          <span>{totalVisits.toLocaleString()} visits</span>
        </>
      )}
      {topCountries.length > 0 && (
        <>
          <span className="stats-divider">•</span>
          <span className="stats-flags">
            {topCountries.map((c) => c.flag).join(" ")}
          </span>
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <StatsWidget />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
      <Analytics />
    </Router>
  );
};

export default App;
