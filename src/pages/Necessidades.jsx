import React, { useState, useEffect } from 'react';
import { necessidadesService } from '../services/api';

export default function Necessidades() {
  const [necessidades, setNecessidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroUrgencia, setFiltroUrgencia] = useState('');

  const carregar = async () => {
    setLoading(true);
    try {
      const params = filtroUrgencia ? { urgencia: filtroUrgencia } : {};
      const res = await necessidadesService.listar(params);
      setNecessidades(res.data.dados);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, [filtroUrgencia]);

  const urgenciaLabel = { critica: '🔴 Crítica', alta: '🟠 Alta', media: '🟡 Média', baixa: '🟢 Baixa' };

  return (
    <div className="section">
      <h1 className="section-titulo">Necessidades dos Abrigos</h1>
      <p className="section-sub">Itens necessários listados pelos responsáveis — ordenados por urgência</p>

      <div className="filtros" style={{ marginBottom: '28px' }}>
        <div className="filtro-grupo">
          <label>Urgência</label>
          <select className="filtro-select" value={filtroUrgencia} onChange={e => setFiltroUrgencia(e.target.value)}>
            <option value="">Todas</option>
            <option value="critica">🔴 Crítica</option>
            <option value="alta">🟠 Alta</option>
            <option value="media">🟡 Média</option>
            <option value="baixa">🟢 Baixa</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">🌊 Carregando necessidades...</div>
      ) : necessidades.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📦</div>
          <div className="empty-text">Nenhuma necessidade encontrada.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {necessidades.map(n => (
            <div key={n.id} className={`nec-card nec-${n.urgencia}`}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '1rem' }}>{n.item}</strong>
                  {n.quantidade && (
                    <span style={{ background: 'var(--branco)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--azul)' }}>
                      {n.quantidade} un.
                    </span>
                  )}
                  <span className={`urgencia-${n.urgencia}`} style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {urgenciaLabel[n.urgencia]}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--cinza)' }}>
                  🏠 {n.abrigo_nome} — {n.abrigo_cidade}
                  <span className={`badge badge-${n.abrigo_status}`} style={{ marginLeft: '8px', padding: '2px 8px', fontSize: '0.72rem' }}>
                    {n.abrigo_status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
