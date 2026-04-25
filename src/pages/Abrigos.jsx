import React, { useState, useEffect, useCallback } from 'react';
import { abrigosService } from '../services/api';
import CardAbrigo from '../components/CardAbrigo';
import FormAbrigo from '../components/FormAbrigo';

export default function Abrigos({ navegar }) {
  const [abrigos, setAbrigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [filtros, setFiltros] = useState({ cidade: '', status: '', com_vagas: false, aceita_animais: false, aceita_pcd: false });

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.cidade) params.cidade = filtros.cidade;
      if (filtros.status) params.status = filtros.status;
      if (filtros.com_vagas) params.com_vagas = 'true';
      if (filtros.aceita_animais) params.aceita_animais = 'true';
      if (filtros.aceita_pcd) params.aceita_pcd = 'true';
      const res = await abrigosService.listar(params);
      setAbrigos(res.data.dados);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar abrigos. Verifique se o servidor está rodando.' });
    } finally { setLoading(false); }
  }, [filtros]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleCriar = async (dados) => {
    try {
      await abrigosService.criar(dados);
      setMostrarForm(false);
      setMensagem({ tipo: 'sucesso', texto: '✅ Abrigo cadastrado! Aguardando aprovação do administrador.' });
      carregar();
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.response?.data?.mensagem || 'Erro ao cadastrar abrigo.' });
    }
  };

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="section-titulo">Abrigos disponíveis</h1>
          <p className="section-sub">{abrigos.length} abrigo(s) encontrado(s)</p>
        </div>
        <button className="btn-primary btn-lg" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? '✕ Cancelar' : '+ Cadastrar Abrigo'}
        </button>
      </div>

      {mensagem && (
        <div className={`alerta alerta-${mensagem.tipo}`}>
          {mensagem.texto}
          <button onClick={() => setMensagem(null)} style={{ float: 'right', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {mostrarForm && (
        <div style={{ marginBottom: '32px' }}>
          <FormAbrigo onSubmit={handleCriar} onCancelar={() => setMostrarForm(false)} />
          <p style={{ textAlign: 'center', color: 'var(--cinza)', fontSize: '0.85rem', marginTop: '12px' }}>
            ℹ️ O abrigo ficará pendente até ser aprovado pelo administrador.
          </p>
        </div>
      )}

      <div className="filtros">
        <div className="filtro-grupo">
          <label>Cidade</label>
          <input className="filtro-input" placeholder="Ex: Porto Alegre" value={filtros.cidade}
            onChange={e => setFiltros(f => ({ ...f, cidade: e.target.value }))} />
        </div>
        <div className="filtro-grupo">
          <label>Status</label>
          <select className="filtro-select" value={filtros.status}
            onChange={e => setFiltros(f => ({ ...f, status: e.target.value }))}>
            <option value="">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="lotado">Lotado</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <label className="filtro-check">
          <input type="checkbox" checked={filtros.com_vagas} onChange={e => setFiltros(f => ({ ...f, com_vagas: e.target.checked }))} />
          Só com vagas
        </label>
        <label className="filtro-check">
          <input type="checkbox" checked={filtros.aceita_animais} onChange={e => setFiltros(f => ({ ...f, aceita_animais: e.target.checked }))} />
          Aceita animais
        </label>
        <label className="filtro-check">
          <input type="checkbox" checked={filtros.aceita_pcd} onChange={e => setFiltros(f => ({ ...f, aceita_pcd: e.target.checked }))} />
          Acessível PCD
        </label>
        <button className="btn-sm btn-cinza" onClick={() => setFiltros({ cidade: '', status: '', com_vagas: false, aceita_animais: false, aceita_pcd: false })}>
          Limpar
        </button>
      </div>

      {loading ? (
        <div className="loading">🌊 Carregando abrigos...</div>
      ) : abrigos.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏠</div>
          <div className="empty-text">Nenhum abrigo encontrado.</div>
        </div>
      ) : (
        <div className="cards-grid">
          {abrigos.map(a => (
            <CardAbrigo key={a.id} abrigo={a} onVer={() => navegar('detalhe', a)} />
          ))}
        </div>
      )}
    </div>
  );
}
