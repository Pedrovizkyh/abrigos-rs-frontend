import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({ baseURL: API_BASE });

export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  perfil: () => api.get('/auth/perfil'),
  alterarSenha: (senha_atual, nova_senha) => api.post('/auth/alterar-senha', { senha_atual, nova_senha }),
};

export const abrigosService = {
  listar: (filtros = {}) => api.get('/abrigos', { params: filtros }),
  buscarPorId: (id) => api.get(`/abrigos/${id}`),
  criar: (dados) => api.post('/abrigos', dados),
  atualizar: (id, dados) => api.put(`/abrigos/${id}`, dados),
  atualizarVagas: (id, vagas_disponiveis) => api.patch(`/abrigos/${id}/vagas`, { vagas_disponiveis }),
  aprovar: (id, aprovar) => api.patch(`/abrigos/${id}/aprovar`, { aprovar }),
  deletar: (id) => api.delete(`/abrigos/${id}`),
  estatisticas: () => api.get('/abrigos/stats'),
};

export const necessidadesService = {
  listar: (filtros = {}) => api.get('/necessidades', { params: filtros }),
  criar: (dados) => api.post('/necessidades', dados),
  deletar: (id) => api.delete(`/necessidades/${id}`),
};
