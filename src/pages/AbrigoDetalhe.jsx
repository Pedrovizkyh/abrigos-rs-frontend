import React, { useState, useEffect } from 'react';
import { abrigosService } from '../services/api';

export default function AbrigoDetalhe({ abrigo: abrigoInicial, navegar }) {
  const [abrigo, setAbrigo] = useState(abrigoInicial);

  useEffect(() => {
    abrigosService.buscarPorId(abrigoInicial.id)
      .then(res => setAbrigo(res.data.dados))
      .catch(() => {});
  }, [abrigoInicial.id]);

  const pct = abrigo.capacidade_total
    ? Math.round(((abrigo.capacidade_total - abrigo.vagas_disponiveis) / abrigo.capacidade_total) * 100)
    : 0;
  const cor = pct >= 90 ? 'vermelho' : pct >= 60 ? 'amarelo' : 'verde';
  const urgLabel = { critica: '🔴 Crítica', alta: '🟠 Alta', media: '🟡 Média', baixa: '🟢 Baixa' };

  return (
    <>
      <div className="detalhe-header">
        <div className="detalhe-inner">
          <button className="btn-sm btn-cinza" onClick={() => navegar('abrigos')} style={{ marginBottom: '16px' }}>← Voltar</button>
          <span className={`badge badge-${abrigo.status}`}>{abrigo.status.toUpperCase()}</span>
          <h1 className="detalhe-titulo">{abrigo.nome}</h1>
          <p style={{ color: 'var(--agua-claro)' }}>📍 {abrigo.endereco}, {abrigo.cidade} – {abrigo.estado}</p>
        </div>
      </div>

      <div className="detalhe-body">
        <div className="detalhe-grid">
          <div>
            {/* Vagas */}
            <div className="info-card" style={{ marginBottom: '20px' }}>
              <div className="info-titulo">📊 Situação das Vagas</div>
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 800, color: 'var(--azul-claro)' }}>
                  {abrigo.vagas_disponiveis}
                </span>
                <span style={{ color: 'var(--cinza)' }}> / {abrigo.capacidade_total} vagas</span>
              </div>
              <div className="progress" style={{ height: '12px', marginBottom: '8px' }}>
                <div className={`progress-fill progress-${cor}`} style={{ width: `${pct}%` }} />
              </div>
              <p style={{ textAlign: 'center', color: 'var(--cinza)', fontSize: '0.85rem' }}>{pct}% ocupado</p>
              {abrigo.status === 'lotado' && (
                <div className="alerta alerta-erro" style={{ marginTop: '16px', textAlign: 'center' }}>
                  ⚠️ Este abrigo está lotado. Procure outro abrigo disponível.
                </div>
              )}
            </div>

            {/* Necessidades (só leitura) */}
            {abrigo.necessidades?.length > 0 && (
              <div className="info-card">
                <div className="info-titulo">📦 O que este abrigo precisa</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {abrigo.necessidades.map(n => (
                    <div key={n.id} className={`nec-card nec-${n.urgencia}`}>
                      <div>
                        <strong>{n.item}</strong>
                        {n.quantidade && <span style={{ color: 'var(--cinza)', fontSize: '0.82rem' }}> — {n.quantidade} un.</span>}
                        <div className={`urgencia-${n.urgencia}`} style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                          {urgLabel[n.urgencia]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--cinza)', marginTop: '12px' }}>
                  💡 Se puder ajudar, entre em contato com o responsável do abrigo.
                </p>
              </div>
            )}
          </div>

          {/* Info lateral */}
          <div>
            <div className="info-card" style={{ marginBottom: '16px' }}>
              <div className="info-titulo">ℹ️ Informações</div>
              {[['Responsável', abrigo.responsavel || '—'],['Telefone', abrigo.telefone || '—'],['Cidade', `${abrigo.cidade} / ${abrigo.estado}`]].map(([k,v]) => (
                <div className="info-row" key={k}><span>{k}</span><strong>{v}</strong></div>
              ))}
            </div>
            <div className="info-card" style={{ marginBottom: '16px' }}>
              <div className="info-titulo">🛠️ Recursos</div>
              {[['Aceita animais', abrigo.aceita_animais],['Acessível PCD', abrigo.aceita_pcd],['Tem banheiro', abrigo.tem_banheiro],['Tem alimentação', abrigo.tem_alimentacao]].map(([k,v]) => (
                <div className="info-row" key={k}>
                  <span>{k}</span>
                  <strong style={{ color: v ? 'var(--verde)' : 'var(--cinza)' }}>{v ? '✓ Sim' : '✗ Não'}</strong>
                </div>
              ))}
            </div>
            {abrigo.observacoes && (
              <div className="info-card">
                <div className="info-titulo">📝 Observações</div>
                <p style={{ color: 'var(--azul)', fontSize: '0.9rem', lineHeight: '1.6' }}>{abrigo.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
