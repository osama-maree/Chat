
import './App.css';
// import { Button } from "@chakra-ui/react";
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register.jsx';
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="chats" element={<Chat />} />
        <Route path="register" element={<Register />} />

      </Routes>
    </div>
  );
}

export default App;
