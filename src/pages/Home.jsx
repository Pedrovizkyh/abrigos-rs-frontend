import React, { useEffect, useState } from 'react';
import { abrigosService } from '../services/api';

export default function Home({ navegar }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    abrigosService.estatisticas()
      .then(res => setStats(res.data.dados))
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="hero">
        <h1 className="hero-titulo">
          Encontre um abrigo <span>seguro</span> agora
        </h1>
        <p className="hero-sub">
          Plataforma de informação em tempo real para conectar pessoas afetadas pelas enchentes com abrigos disponíveis no Rio Grande do Sul.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => navegar('abrigos', { filtro: 'com_vagas' })}>
            🏠 Ver Abrigos com Vagas
          </button>
          <button className="btn-outline" onClick={() => navegar('necessidades')}>
            📦 Ver Necessidades Urgentes
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats-bar" style={{ margin: '-30px auto 0', padding: '0 24px' }}>
          <div className="stat-item">
            <div className="stat-num">{stats.total_abrigos}</div>
            <div className="stat-label">Abrigos Cadastrados</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--verde)' }}>{stats.total_vagas_disponiveis}</div>
            <div className="stat-label">Vagas Disponíveis</div>
          </div>
          <div className="stat-item">
            <div className="stat-num" style={{ color: 'var(--vermelho)' }}>{stats.abrigos_lotados}</div>
            <div className="stat-label">Abrigos Lotados</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">{stats.capacidade_total}</div>
            <div className="stat-label">Capacidade Total</div>
          </div>
        </div>
      )}

      <div className="section" style={{ paddingTop: '80px' }}>
        <h2 className="section-titulo">Como funciona?</h2>
        <p className="section-sub">Uma plataforma simples para momentos que exigem agilidade</p>
        <div className="cards-grid">
          {[
            { icon: '🔍', titulo: 'Busque abrigos', desc: 'Filtre por cidade, vagas disponíveis, aceite de animais ou acessibilidade para PCD.' },
            { icon: '📍', titulo: 'Informações em tempo real', desc: 'Vagas atualizadas pelos responsáveis dos abrigos para que a informação seja sempre confiável.' },
            { icon: '📦', titulo: 'Veja o que precisam', desc: 'Cada abrigo pode listar suas necessidades urgentes para ajudar na organização de doações.' },
            { icon: '✏️', titulo: 'Cadastre um abrigo', desc: 'Voluntários e ONGs podem cadastrar novos pontos de abrigo e manter as informações atualizadas.' },
          ].map((item, i) => (
            <div className="card" key={i} style={{ padding: '24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{item.icon}</div>
              <div className="card-nome">{item.titulo}</div>
              <p style={{ color: 'var(--cinza)', fontSize: '0.9rem', marginTop: '8px', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--azul)', color: 'white', padding: '40px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', marginBottom: '12px' }}>Tem um espaço disponível?</h2>
        <p style={{ color: 'var(--agua-claro)', marginBottom: '24px' }}>Cadastre um abrigo e ajude quem mais precisa agora.</p>
        <button className="btn-primary" onClick={() => navegar('abrigos', { acao: 'novo' })}>
          + Cadastrar Abrigo
        </button>
      </div>
    </>
  );
}
