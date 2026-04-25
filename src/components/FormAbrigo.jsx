import React, { useState } from 'react';

const inicial = {
  nome: '', endereco: '', cidade: '', estado: 'RS',
  telefone: '', responsavel: '', capacidade_total: '',
  vagas_disponiveis: '', aceita_animais: false, aceita_pcd: false,
  tem_banheiro: true, tem_alimentacao: false, observacoes: '', status: 'ativo'
};

export default function FormAbrigo({ onSubmit, onCancelar }) {
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const handleSubmit = () => {
    if (!form.nome || !form.endereco || !form.cidade || !form.capacidade_total || form.vagas_disponiveis === '') {
      return setErro('Preencha todos os campos obrigatórios: nome, endereço, cidade, capacidade e vagas.');
    }
    if (parseInt(form.vagas_disponiveis) > parseInt(form.capacidade_total)) {
      return setErro('Vagas disponíveis não podem ser maiores que a capacidade total.');
    }
    setErro('');
    onSubmit({
      ...form,
      capacidade_total: parseInt(form.capacidade_total),
      vagas_disponiveis: parseInt(form.vagas_disponiveis),
    });
  };

  return (
    <div className="form-card">
      <h2 className="form-titulo">🏠 Cadastrar Novo Abrigo</h2>

      {erro && <div className="alerta alerta-erro">{erro}</div>}

      <div className="form-grid">
        <div className="form-grupo full">
          <label>Nome do Abrigo *</label>
          <input placeholder="Ex: Escola Municipal João Paulo" value={form.nome} onChange={e => set('nome', e.target.value)} />
        </div>
        <div className="form-grupo full">
          <label>Endereço *</label>
          <input placeholder="Rua, número, bairro" value={form.endereco} onChange={e => set('endereco', e.target.value)} />
        </div>
        <div className="form-grupo">
          <label>Cidade *</label>
          <input placeholder="Ex: Porto Alegre" value={form.cidade} onChange={e => set('cidade', e.target.value)} />
        </div>
        <div className="form-grupo">
          <label>Estado</label>
          <input placeholder="RS" value={form.estado} onChange={e => set('estado', e.target.value)} maxLength={2} />
        </div>
        <div className="form-grupo">
          <label>Responsável</label>
          <input placeholder="Nome do responsável" value={form.responsavel} onChange={e => set('responsavel', e.target.value)} />
        </div>
        <div className="form-grupo">
          <label>Telefone</label>
          <input placeholder="(51) 99999-9999" value={form.telefone} onChange={e => set('telefone', e.target.value)} />
        </div>
        <div className="form-grupo">
          <label>Capacidade Total *</label>
          <input type="number" min="1" placeholder="Ex: 100" value={form.capacidade_total} onChange={e => set('capacidade_total', e.target.value)} />
        </div>
        <div className="form-grupo">
          <label>Vagas Disponíveis *</label>
          <input type="number" min="0" placeholder="Ex: 50" value={form.vagas_disponiveis} onChange={e => set('vagas_disponiveis', e.target.value)} />
        </div>
        <div className="form-grupo full">
          <label>Recursos disponíveis</label>
          <div className="form-checks">
            {[
              ['aceita_animais', '🐾 Aceita animais'],
              ['aceita_pcd', '♿ Acessível PCD'],
              ['tem_banheiro', '🚿 Tem banheiro'],
              ['tem_alimentacao', '🍽️ Fornece alimentação'],
            ].map(([campo, label]) => (
              <label className="form-check" key={campo}>
                <input type="checkbox" checked={form[campo]} onChange={e => set(campo, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div className="form-grupo full">
          <label>Observações</label>
          <textarea placeholder="Informações adicionais, regras do abrigo, horários..." value={form.observacoes} onChange={e => set('observacoes', e.target.value)} />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-lg btn-sm btn-cinza" onClick={onCancelar}>Cancelar</button>
        <button className="btn-lg btn-primary" onClick={handleSubmit}>Cadastrar Abrigo</button>
      </div>
    </div>
  );
}
