import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InvitePage from './pages/InvitePage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvitePage />} />
          <Route path="/invite/:slug" element={<InvitePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
