import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export default function Login({ navegar }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.senha) {
      return setErro('Preencha email e senha.');
    }
    setLoading(true);
    setErro('');
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, form);
      login(res.data.token, res.data.admin);
      navegar('admin');
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px'
    }}>
      <div className="form-card" style={{ maxWidth: '420px', width: '100%' }}>
        {/* Ícone */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--azul)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem'
          }}>🔒</div>
          <h2 className="form-titulo" style={{ marginTop: '16px', marginBottom: '4px' }}>
            Acesso Administrativo
          </h2>
          <p style={{ color: 'var(--cinza)', fontSize: '0.9rem' }}>
            Área restrita — somente administradores
          </p>
        </div>

        {erro && (
          <div className="alerta alerta-erro" style={{ marginBottom: '20px' }}>
            {erro}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-grupo">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@abrigosrs.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={handleKey}
              autoFocus
            />
          </div>
          <div className="form-grupo">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
              onKeyDown={handleKey}
            />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <button
            className="btn-sm btn-cinza"
            onClick={() => navegar('home')}
            style={{ width: '100%', padding: '10px' }}
          >
            ← Voltar ao site
          </button>
        </div>

        <p style={{
          marginTop: '20px', fontSize: '0.78rem', color: 'var(--cinza)',
          textAlign: 'center', lineHeight: '1.5'
        }}>
          Credenciais padrão: <code>admin@abrigosrs.com</code> / <code>admin123</code><br />
          <strong style={{ color: 'var(--laranja)' }}>Troque a senha após o primeiro acesso.</strong>
        </p>
      </div>
    </div>
  );
}
