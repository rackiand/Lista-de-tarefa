import React from 'react';
import ReactDOM from 'react-dom/client'; // Atualizado para 'react-dom/client'
import './App.css'; // Importando o CSS aqui
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root')); // Criando o root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
