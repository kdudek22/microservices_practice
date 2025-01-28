import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/home.tsx";
import Login from "./components/login.tsx";

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
