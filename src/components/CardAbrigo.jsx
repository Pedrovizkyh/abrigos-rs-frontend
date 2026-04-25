import React from 'react';

function calcPct(total, disponiveis) {
  if (!total) return 0;
  return Math.round(((total - disponiveis) / total) * 100);
}

export default function CardAbrigo({ abrigo, onVer }) {
  const pct = calcPct(abrigo.capacidade_total, abrigo.vagas_disponiveis);
  const cor = pct >= 90 ? 'vermelho' : pct >= 60 ? 'amarelo' : 'verde';

  return (
    <div className="card">
      <div className="card-header">
        <span className={`badge badge-${abrigo.status}`}>{abrigo.status.toUpperCase()}</span>
        <div className="card-nome">{abrigo.nome}</div>
        <div className="card-cidade">📍 {abrigo.cidade} – {abrigo.estado}</div>
      </div>

      <div className="card-body">
        <div className="vagas-bar">
          <div className="vagas-info">
            <strong>{abrigo.vagas_disponiveis} vagas disponíveis</strong>
            <span>de {abrigo.capacidade_total}</span>
          </div>
          <div className="progress">
            <div className={`progress-fill progress-${cor}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="tags">
          {abrigo.aceita_animais && <span className="tag">🐾 Animais</span>}
          {abrigo.aceita_pcd && <span className="tag">♿ PCD</span>}
          {abrigo.tem_alimentacao && <span className="tag">🍽️ Alimentação</span>}
          {abrigo.tem_banheiro && <span className="tag">🚿 Banheiro</span>}
        </div>

        {abrigo.necessidades?.length > 0 && (
          <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--laranja)', fontWeight: 600 }}>
            📦 {abrigo.necessidades.length} necessidade(s) listada(s)
          </div>
        )}
      </div>

      <div className="card-footer">
        <button className="btn-sm btn-azul" onClick={onVer} style={{ flex: 1 }}>Ver detalhes</button>
      </div>
    </div>
  );
}
