import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Market from "./Pages/Market/Market";
import NotFound from "./Pages/NotFound/NotFound";
import Trade from "./Pages/Trade/Trade";
import Portfolio from "./Pages/Portfolio/Portfolio";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/market" element={<Market />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
