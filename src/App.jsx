import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Abrigos from './pages/Abrigos';
import AbrigoDetalhe from './pages/AbrigoDetalhe';
import Necessidades from './pages/Necessidades';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './App.css';

function AppInner() {
  const { isAdmin, admin, logout } = useAuth();
  const [pagina, setPagina] = useState('home');
  const [abrigoSelecionado, setAbrigoSelecionado] = useState(null);

  const navegar = (p, dados = null) => {
    setAbrigoSelecionado(dados);
    setPagina(p);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <button className="logo" onClick={() => navegar('home')}>
            <span className="logo-icon">🌊</span>
            <span className="logo-text">Abrigos<strong>RS</strong></span>
          </button>
          <nav className="nav">
            <button className={pagina === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => navegar('home')}>Início</button>
            <button className={pagina === 'abrigos' ? 'nav-link active' : 'nav-link'} onClick={() => navegar('abrigos')}>Abrigos</button>
            <button className={pagina === 'necessidades' ? 'nav-link active' : 'nav-link'} onClick={() => navegar('necessidades')}>Necessidades</button>
            {isAdmin ? (
              <>
                <button className={pagina === 'admin' ? 'nav-link active' : 'nav-link'} onClick={() => navegar('admin')}
                  style={{ color: 'var(--amarelo)' }}>
                  ⚙️ Painel
                </button>
                <button className="nav-link" onClick={() => { logout(); navegar('home'); }}
                  style={{ color: '#f88' }}>
                  Sair
                </button>
              </>
            ) : (
              <button className="nav-link" onClick={() => navegar('login')}
                style={{ color: 'var(--cinza)', fontSize: '0.8rem' }}>
                🔒 Admin
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        {pagina === 'home'         && <Home navegar={navegar} />}
        {pagina === 'abrigos'      && <Abrigos navegar={navegar} />}
        {pagina === 'detalhe'      && <AbrigoDetalhe abrigo={abrigoSelecionado} navegar={navegar} />}
        {pagina === 'necessidades' && <Necessidades />}
        {pagina === 'login'        && <Login navegar={navegar} />}
        {pagina === 'admin'        && (isAdmin ? <Admin navegar={navegar} /> : <Login navegar={navegar} />)}
      </main>

      <footer className="footer">
        <p>🌊 AbrigosRS — Conectando pessoas em momentos de crise · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
