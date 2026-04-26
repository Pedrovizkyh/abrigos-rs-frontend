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
  const { isAdmin, logout } = useAuth();
  const [pagina, setPagina] = useState('home');
  const [abrigoSelecionado, setAbrigoSelecionado] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const navegar = (p, dados = null) => {
    setAbrigoSelecionado(dados);
    setPagina(p);
    setMenuAberto(false);
    window.scrollTo(0, 0);
  };

  const links = [
    { id: 'home', label: '🏠 Início' },
    { id: 'abrigos', label: '🏘️ Abrigos' },
    { id: 'necessidades', label: '📦 Necessidades' },
    ...(isAdmin
      ? [{ id: 'admin', label: '⚙️ Painel', cor: 'var(--amarelo)' },
         { id: '__logout', label: '🚪 Sair', cor: '#f88' }]
      : [{ id: 'login', label: '🔒 Admin', cor: 'var(--cinza)' }]
    ),
  ];

  const handleLink = (id) => {
    if (id === '__logout') { logout(); navegar('home'); }
    else navegar(id);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <button className="logo" onClick={() => navegar('home')}>
            <span className="logo-icon">🌊</span>
            <span className="logo-text">Abrigos<strong>RS</strong></span>
          </button>

          {/* Desktop nav */}
          <nav className="nav">
            {links.map(l => (
              <button
                key={l.id}
                className={pagina === l.id ? 'nav-link active' : 'nav-link'}
                onClick={() => handleLink(l.id)}
                style={l.cor ? { color: l.cor } : {}}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Hamburguer mobile */}
          <button
            className={`hamburger ${menuAberto ? 'aberto' : ''}`}
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile nav dropdown */}
        <nav className={`nav-mobile ${menuAberto ? 'aberto' : ''}`}>
          {links.map(l => (
            <button
              key={l.id}
              className={pagina === l.id ? 'nav-link active' : 'nav-link'}
              onClick={() => handleLink(l.id)}
              style={l.cor ? { color: l.cor } : {}}
            >
              {l.label}
            </button>
          ))}
        </nav>
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
