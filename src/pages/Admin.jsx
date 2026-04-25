import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { abrigosService, necessidadesService, authService } from '../services/api';

// ── Subcomponente: card da fila de aprovação ─────────────────────────────
function CardPendente({ abrigo, onAprovar, onRejeitar }) {
  return (
    <div style={{
      background: 'white', border: '1.5px solid #fde8c0', borderRadius: '14px',
      padding: '20px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            background: '#fde8c0', color: '#7a4e0a', fontSize: '0.72rem',
            fontWeight: 600, padding: '2px 10px', borderRadius: '20px'
          }}>⏳ PENDENTE</span>
        </div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--azul)' }}>
          {abrigo.nome}
        </div>
        <div style={{ color: 'var(--cinza)', fontSize: '0.85rem', marginTop: '2px' }}>
          📍 {abrigo.endereco}, {abrigo.cidade} – {abrigo.estado}
        </div>
        <div style={{ color: 'var(--cinza)', fontSize: '0.82rem', marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <span>👥 {abrigo.vagas_disponiveis}/{abrigo.capacidade_total} vagas</span>
          {abrigo.responsavel && <span>👤 {abrigo.responsavel}</span>}
          {abrigo.telefone && <span>📞 {abrigo.telefone}</span>}
        </div>
        {abrigo.observacoes && (
          <div style={{
            marginTop: '8px', padding: '8px 12px', background: 'var(--branco)',
            borderRadius: '8px', fontSize: '0.82rem', color: 'var(--azul)',
            borderLeft: '3px solid #e0eaf5'
          }}>
            {abrigo.observacoes}
          </div>
        )}
        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {abrigo.aceita_animais && <span className="tag">🐾 Animais</span>}
          {abrigo.aceita_pcd && <span className="tag">♿ PCD</span>}
          {abrigo.tem_alimentacao && <span className="tag">🍽️ Alimentação</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button className="btn-sm btn-verde" onClick={() => onAprovar(abrigo.id, abrigo.nome)}>
          ✓ Aprovar
        </button>
        <button className="btn-sm btn-vermelho" onClick={() => onRejeitar(abrigo.id, abrigo.nome)}>
          ✕ Rejeitar
        </button>
      </div>
    </div>
  );
}

// ── Subcomponente: linha da lista de abrigos aprovados ───────────────────
function LinhaAbrigo({ abrigo, onEditar, onRevogar, onDeletar }) {
  const pct = abrigo.capacidade_total
    ? Math.round(((abrigo.capacidade_total - abrigo.vagas_disponiveis) / abrigo.capacidade_total) * 100)
    : 0;

  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
      boxShadow: '0 1px 6px rgba(10,37,64,.07)', border: '1px solid #e8f0f8'
    }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ fontWeight: 600, color: 'var(--azul)', fontSize: '0.95rem' }}>{abrigo.nome}</div>
        <div style={{ color: 'var(--cinza)', fontSize: '0.82rem' }}>📍 {abrigo.cidade} · {abrigo.vagas_disponiveis}/{abrigo.capacidade_total} vagas · {pct}% ocupado</div>
      </div>
      <span className={`badge badge-${abrigo.status}`} style={{ flexShrink: 0 }}>{abrigo.status}</span>
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button className="btn-sm btn-azul" onClick={() => onEditar(abrigo)}>✏️ Editar</button>
        <button className="btn-sm btn-cinza" onClick={() => onRevogar(abrigo.id, abrigo.nome)} title="Remover aprovação">⊘</button>
        <button className="btn-sm btn-vermelho" onClick={() => onDeletar(abrigo.id, abrigo.nome)}>🗑️</button>
      </div>
    </div>
  );
}

// ── Modal de edição ──────────────────────────────────────────────────────
function ModalEditar({ abrigo, onSalvar, onFechar }) {
  const [form, setForm] = useState({ ...abrigo });
  const [salvando, setSalvando] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSalvar = async () => {
    setSalvando(true);
    await onSalvar(abrigo.id, {
      ...form,
      capacidade_total: parseInt(form.capacidade_total),
      vagas_disponiveis: parseInt(form.vagas_disponiveis),
    });
    setSalvando(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,37,64,.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999, padding: '24px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '32px',
        width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 className="form-titulo" style={{ marginBottom: '20px' }}>✏️ Editar Abrigo</h3>
        <div className="form-grid">
          {[
            ['nome', 'Nome *', 'text', false],
            ['endereco', 'Endereço *', 'text', false],
            ['cidade', 'Cidade *', 'text', false],
            ['estado', 'Estado', 'text', false],
            ['responsavel', 'Responsável', 'text', false],
            ['telefone', 'Telefone', 'text', false],
            ['capacidade_total', 'Capacidade Total', 'number', false],
            ['vagas_disponiveis', 'Vagas Disponíveis', 'number', false],
          ].map(([campo, label, tipo]) => (
            <div className="form-grupo" key={campo}>
              <label>{label}</label>
              <input type={tipo} value={form[campo] || ''} onChange={e => set(campo, e.target.value)} />
            </div>
          ))}
          <div className="form-grupo" style={{ gridColumn: '1/-1' }}>
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="ativo">Ativo</option>
              <option value="lotado">Lotado</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div className="form-grupo" style={{ gridColumn: '1/-1' }}>
            <label>Recursos</label>
            <div className="form-checks">
              {[['aceita_animais','🐾 Animais'],['aceita_pcd','♿ PCD'],['tem_banheiro','🚿 Banheiro'],['tem_alimentacao','🍽️ Alimentação']].map(([k,l]) => (
                <label className="form-check" key={k}>
                  <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} />{l}
                </label>
              ))}
            </div>
          </div>
          <div className="form-grupo" style={{ gridColumn: '1/-1' }}>
            <label>Observações</label>
            <textarea value={form.observacoes || ''} onChange={e => set('observacoes', e.target.value)} />
          </div>
        </div>
        <div className="form-actions" style={{ marginTop: '20px' }}>
          <button className="btn-sm btn-cinza btn-lg" onClick={onFechar}>Cancelar</button>
          <button className="btn-primary btn-lg" onClick={handleSalvar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Aba: Alterar Senha ───────────────────────────────────────────────────
function AlterarSenha() {
  const [form, setForm] = useState({ senha_atual: '', nova_senha: '', confirmar: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (form.nova_senha !== form.confirmar) {
      return setMsg({ tipo: 'erro', texto: 'As senhas não coincidem.' });
    }
    if (form.nova_senha.length < 6) {
      return setMsg({ tipo: 'erro', texto: 'A nova senha deve ter pelo menos 6 caracteres.' });
    }
    setLoading(true);
    try {
      await authService.alterarSenha(form.senha_atual, form.nova_senha);
      setMsg({ tipo: 'sucesso', texto: '✅ Senha alterada com sucesso!' });
      setForm({ senha_atual: '', nova_senha: '', confirmar: '' });
    } catch (e) {
      setMsg({ tipo: 'erro', texto: e.response?.data?.mensagem || 'Erro ao alterar senha.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: '460px' }}>
      <h3 className="form-titulo">🔑 Alterar Senha</h3>
      {msg && <div className={`alerta alerta-${msg.tipo}`}>{msg.texto}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[['senha_atual','Senha atual','password'],['nova_senha','Nova senha','password'],['confirmar','Confirmar nova senha','password']].map(([k,l,t]) => (
          <div className="form-grupo" key={k}>
            <label>{l}</label>
            <input type={t} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <button className="btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Salvando...' : 'Alterar senha'}
        </button>
      </div>
    </div>
  );
}

// ── Página principal do Admin ────────────────────────────────────────────
export default function Admin({ navegar }) {
  const { admin, logout } = useAuth();
  const [aba, setAba] = useState('pendentes');
  const [pendentes, setPendentes] = useState([]);
  const [aprovados, setAprovados] = useState([]);
  const [necessidades, setNecessidades] = useState([]);
  const [novaNec, setNovaNec] = useState({ abrigo_id: '', item: '', quantidade: '', urgencia: 'media' });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [editando, setEditando] = useState(null);

  const msg = (tipo, texto) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 4000);
  };

  const carregarPendentes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await abrigosService.listar({ pendentes: 'true' });
      setPendentes(res.data.dados);
    } finally { setLoading(false); }
  }, []);

  const carregarAprovados = useCallback(async () => {
    setLoading(true);
    try {
      const res = await abrigosService.listar({});
      setAprovados(res.data.dados);
    } finally { setLoading(false); }
  }, []);

  const carregarNecessidades = useCallback(async () => {
    const res = await necessidadesService.listar({});
    setNecessidades(res.data.dados);
  }, []);

  useEffect(() => {
    if (aba === 'pendentes') carregarPendentes();
    if (aba === 'aprovados') carregarAprovados();
    if (aba === 'necessidades') { carregarAprovados(); carregarNecessidades(); }
  }, [aba]);

  const handleAprovar = async (id, nome) => {
    try {
      await abrigosService.aprovar(id, true);
      msg('sucesso', `✅ "${nome}" aprovado e visível ao público!`);
      carregarPendentes();
    } catch { msg('erro', 'Erro ao aprovar abrigo.'); }
  };

  const handleRejeitar = async (id, nome) => {
    if (!window.confirm(`Rejeitar e remover o abrigo "${nome}"?`)) return;
    try {
      await abrigosService.deletar(id);
      msg('sucesso', `Abrigo "${nome}" removido.`);
      carregarPendentes();
    } catch { msg('erro', 'Erro ao rejeitar abrigo.'); }
  };

  const handleRevogar = async (id, nome) => {
    if (!window.confirm(`Remover "${nome}" da listagem pública?`)) return;
    try {
      await abrigosService.aprovar(id, false);
      msg('sucesso', `"${nome}" removido da listagem pública.`);
      carregarAprovados();
    } catch { msg('erro', 'Erro ao revogar aprovação.'); }
  };

  const handleDeletar = async (id, nome) => {
    if (!window.confirm(`Deletar permanentemente "${nome}"?`)) return;
    try {
      await abrigosService.deletar(id);
      msg('sucesso', `"${nome}" deletado.`);
      carregarAprovados();
    } catch { msg('erro', 'Erro ao deletar.'); }
  };

  const handleSalvar = async (id, dados) => {
    try {
      await abrigosService.atualizar(id, dados);
      msg('sucesso', 'Abrigo atualizado com sucesso!');
      setEditando(null);
      carregarAprovados();
    } catch { msg('erro', 'Erro ao atualizar abrigo.'); }
  };

  const handleAddNecessidade = async () => {
    if (!novaNec.abrigo_id || !novaNec.item) {
      return msg('erro', 'Selecione o abrigo e informe o item.');
    }
    try {
      await necessidadesService.criar({
        abrigo_id: parseInt(novaNec.abrigo_id),
        item: novaNec.item,
        quantidade: novaNec.quantidade || null,
        urgencia: novaNec.urgencia
      });
      setNovaNec({ abrigo_id: '', item: '', quantidade: '', urgencia: 'media' });
      msg('sucesso', 'Necessidade registrada!');
      carregarNecessidades();
    } catch { msg('erro', 'Erro ao registrar necessidade.'); }
  };

  const handleRemoverNec = async (id, item) => {
    if (!window.confirm(`Marcar "${item}" como atendido?`)) return;
    try {
      await necessidadesService.deletar(id);
      carregarNecessidades();
    } catch { msg('erro', 'Erro ao remover necessidade.'); }
  };

  const urgLabel = { critica: '🔴 Crítica', alta: '🟠 Alta', media: '🟡 Média', baixa: '🟢 Baixa' };
  const abas = [
    { id: 'pendentes', label: `⏳ Pendentes${pendentes.length ? ` (${pendentes.length})` : ''}` },
    { id: 'aprovados', label: '✅ Abrigos aprovados' },
    { id: 'necessidades', label: '📦 Necessidades' },
    { id: 'senha', label: '🔑 Alterar senha' },
  ];

  return (
    <>
      {editando && (
        <ModalEditar
          abrigo={editando}
          onSalvar={handleSalvar}
          onFechar={() => setEditando(null)}
        />
      )}

      {/* Header do painel */}
      <div style={{ background: 'var(--azul)', padding: '28px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: 'var(--agua-claro)', fontSize: '0.82rem', marginBottom: '4px' }}>Painel Administrativo</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '1.6rem', fontWeight: 700 }}>
              Olá, {admin?.nome} 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-sm btn-cinza" onClick={() => navegar('abrigos')}>← Ver site</button>
            <button className="btn-sm btn-vermelho" onClick={() => { logout(); navegar('home'); }}>Sair</button>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div style={{ background: 'var(--azul-medio)', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '4px', padding: '0 24px', overflowX: 'auto' }}>
          {abas.map(a => (
            <button key={a.id} onClick={() => setAba(a.id)} style={{
              padding: '14px 20px', color: aba === a.id ? 'white' : 'var(--agua-claro)',
              borderBottom: aba === a.id ? '3px solid var(--agua)' : '3px solid transparent',
              fontWeight: aba === a.id ? 600 : 400, fontSize: '0.9rem',
              whiteSpace: 'nowrap', transition: 'all .15s'
            }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {mensagem && (
          <div className={`alerta alerta-${mensagem.tipo}`} style={{ marginBottom: '20px' }}>
            {mensagem.texto}
          </div>
        )}

        {/* ── ABA PENDENTES ── */}
        {aba === 'pendentes' && (
          <>
            <h2 className="section-titulo" style={{ marginBottom: '8px' }}>Abrigos aguardando aprovação</h2>
            <p className="section-sub" style={{ marginBottom: '24px' }}>
              Cadastros enviados pelo público que precisam de revisão antes de aparecer no site.
            </p>
            {loading ? <div className="loading">Carregando...</div>
              : pendentes.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">✅</div>
                  <div className="empty-text">Nenhum abrigo pendente de aprovação.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendentes.map(a => (
                    <CardPendente key={a.id} abrigo={a} onAprovar={handleAprovar} onRejeitar={handleRejeitar} />
                  ))}
                </div>
              )}
          </>
        )}

        {/* ── ABA APROVADOS ── */}
        {aba === 'aprovados' && (
          <>
            <h2 className="section-titulo" style={{ marginBottom: '8px' }}>Abrigos aprovados</h2>
            <p className="section-sub" style={{ marginBottom: '24px' }}>
              {aprovados.length} abrigo(s) visíveis ao público.
            </p>
            {loading ? <div className="loading">Carregando...</div>
              : aprovados.length === 0 ? (
                <div className="empty"><div className="empty-icon">🏠</div><div className="empty-text">Nenhum abrigo aprovado.</div></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {aprovados.map(a => (
                    <LinhaAbrigo key={a.id} abrigo={a}
                      onEditar={() => setEditando(a)}
                      onRevogar={handleRevogar}
                      onDeletar={handleDeletar}
                    />
                  ))}
                </div>
              )}
          </>
        )}

        {/* ── ABA NECESSIDADES ── */}
        {aba === 'necessidades' && (
          <>
            <h2 className="section-titulo" style={{ marginBottom: '8px' }}>Gerenciar Necessidades</h2>
            <p className="section-sub" style={{ marginBottom: '24px' }}>Registre e gerencie os itens necessários em cada abrigo.</p>

            {/* Formulário de nova necessidade */}
            <div className="form-card" style={{ marginBottom: '28px' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
                + Registrar nova necessidade
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr auto', gap: '10px', alignItems: 'end', flexWrap: 'wrap' }}>
                <div className="form-grupo">
                  <label>Abrigo</label>
                  <select className="filtro-select" value={novaNec.abrigo_id} onChange={e => setNovaNec(n => ({...n, abrigo_id: e.target.value}))}>
                    <option value="">Selecione...</option>
                    {aprovados.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>
                <div className="form-grupo">
                  <label>Item</label>
                  <input className="filtro-input" placeholder="Ex: Cobertores" value={novaNec.item} onChange={e => setNovaNec(n => ({...n, item: e.target.value}))} />
                </div>
                <div className="form-grupo">
                  <label>Qtd.</label>
                  <input className="filtro-input" type="number" placeholder="—" value={novaNec.quantidade} onChange={e => setNovaNec(n => ({...n, quantidade: e.target.value}))} />
                </div>
                <div className="form-grupo">
                  <label>Urgência</label>
                  <select className="filtro-select" value={novaNec.urgencia} onChange={e => setNovaNec(n => ({...n, urgencia: e.target.value}))}>
                    <option value="baixa">🟢 Baixa</option>
                    <option value="media">🟡 Média</option>
                    <option value="alta">🟠 Alta</option>
                    <option value="critica">🔴 Crítica</option>
                  </select>
                </div>
                <button className="btn-sm btn-verde" style={{ height: '40px', alignSelf: 'end' }} onClick={handleAddNecessidade}>
                  Adicionar
                </button>
              </div>
            </div>

            {/* Lista de necessidades */}
            {necessidades.length === 0 ? (
              <div className="empty"><div className="empty-icon">📦</div><div className="empty-text">Nenhuma necessidade registrada.</div></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {necessidades.map(n => (
                  <div key={n.id} className={`nec-card nec-${n.urgencia}`}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{n.item}</strong>
                      {n.quantidade && <span style={{ color: 'var(--cinza)', fontSize: '0.82rem' }}> — {n.quantidade} un.</span>}
                      <span className={`urgencia-${n.urgencia}`} style={{ fontSize: '0.78rem', fontWeight: 600, marginLeft: '8px' }}>{urgLabel[n.urgencia]}</span>
                      <div style={{ fontSize: '0.82rem', color: 'var(--cinza)', marginTop: '2px' }}>
                        🏠 {n.abrigo_nome} — {n.abrigo_cidade}
                      </div>
                    </div>
                    <button className="btn-sm btn-verde" style={{ fontSize: '0.8rem' }} onClick={() => handleRemoverNec(n.id, n.item)}>
                      ✓ Atendido
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ABA SENHA ── */}
        {aba === 'senha' && <AlterarSenha />}
      </div>
    </>
  );
}
