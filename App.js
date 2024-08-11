import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Link para o CSS
import TaskList from './TaskList.js'; // Importando o novo componente

function App() {
  return (
    <Router>
      <div>
        <h1>Minha Lista de Tarefas</h1>
        
        {/* Definindo as rotas */}
        <Routes>
          <Route path="/tasks" element={<TaskList />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
