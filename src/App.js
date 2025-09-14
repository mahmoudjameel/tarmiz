import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TramuzWebsite from './components/TramuzWebsite';
import Dashboard from "./components/admin/Dashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TramuzWebsite />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
