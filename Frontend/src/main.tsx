import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './login'; // Importamos tu pantalla de login

// Buscamos el div con id "root" en tu index.html y metemos el Login ahí
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Login />
    </StrictMode>,
);