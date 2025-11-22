import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Router>
  );
};

export default App;
