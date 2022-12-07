import { HashRouter, Routes, Route, Link } from "react-router-dom"
import AboutPage from "./pages/About"
import AmidakujiPage from "./pages/Amidakuji"

function App() {
  return (
    <HashRouter>
      <div className="max-w-lg mx-auto">
        <nav className="px-3 py-1.5 flex justify-between text-xl underline">
          <Link to="/">Amidakuji</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="p-3">
          <Routes>
            <Route path="/" element={<AmidakujiPage/>}/>
            <Route path="/about" element={<AboutPage/>}/>
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
