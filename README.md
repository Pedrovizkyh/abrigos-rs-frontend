# 🖥️ AbrigosRS — Frontend

> Interface web da plataforma de abrigos em situações de enchente no Rio Grande do Sul.

🔗 **Aplicação em produção:** [https://abrigos-rs-frontend.vercel.app](https://abrigos-rs-frontend.vercel.app)  
⚙️ **Repositório Backend:** [https://github.com/SEU_USUARIO/abrigos-rs-backend](https://github.com/SEU_USUARIO/abrigos-rs-backend)  
📋 **Documentação API:** [https://documenter.getpostman.com/view/47434037/2sBXqGr2Nt](https://documenter.getpostman.com/view/47434037/2sBXqGr2Nt)

---

## Sobre o projeto

Este é o frontend da plataforma **AbrigosRS**, desenvolvido como parte de um desafio técnico sobre enchentes no Brasil. A interface permite que qualquer pessoa encontre abrigos disponíveis em tempo real, e que administradores gerenciem as informações com segurança.

---

## Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| React 18 | Biblioteca de UI |
| CSS puro | Estilização |
| Axios | Requisições HTTP |
| Context API | Estado global de autenticação |
| Google Fonts | Tipografia (Syne + DM Sans) |

---

## Estrutura do Projeto

```
src/
├── App.jsx                  # Componente raiz com navegação e menu responsivo
├── App.css                  # Estilos globais com tema azul profundo
├── index.js                 # Entrada da aplicação
├── context/
│   └── AuthContext.jsx      # Estado global de autenticação (token JWT)
├── pages/
│   ├── Home.jsx             # Página inicial com estatísticas em tempo real
│   ├── Abrigos.jsx          # Listagem com filtros e cadastro público
│   ├── AbrigoDetalhe.jsx    # Detalhes do abrigo e necessidades
│   ├── Necessidades.jsx     # Lista geral de necessidades por urgência
│   ├── Login.jsx            # Tela de login administrativo
│   └── Admin.jsx            # Painel admin com 4 abas
├── components/
│   ├── CardAbrigo.jsx       # Card reutilizável com barra de ocupação
│   └── FormAbrigo.jsx       # Formulário de cadastro de abrigo
└── services/
    └── api.js               # Integração com a API via Axios
```

---

## Páginas

### 👥 Acesso Público
- **Início** — estatísticas em tempo real (abrigos, vagas, lotados, capacidade)
- **Abrigos** — listagem com filtros por cidade, status, vagas, animais e PCD
- **Detalhe do Abrigo** — informações completas e itens necessários para doação
- **Necessidades** — lista geral de itens necessários ordenados por urgência
- **Cadastrar Abrigo** — formulário público (abrigo entra como pendente até aprovação)

### 🔒 Acesso Administrativo
- **Login** — autenticação com email e senha
- **Painel Admin** — 4 abas:
  - **Pendentes** — aprovar ou rejeitar abrigos cadastrados pelo público
  - **Aprovados** — editar, revogar aprovação ou deletar abrigos
  - **Necessidades** — registrar e marcar itens como atendidos
  - **Alterar Senha** — troca de senha com validação da senha atual

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Backend rodando em `http://localhost:3001`

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/abrigos-rs-frontend.git
cd abrigos-rs-frontend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure a URL da API
Crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

> Em produção, essa variável aponta para a URL do Render.

### 4. Inicie a aplicação
```bash
npm start
```

Aplicação rodando em `http://localhost:3000`

---

## Deploy (Vercel)

### Variáveis de ambiente na Vercel

| Key | Valor |
|-----|-------|
| `REACT_APP_API_URL` | `https://abrigos-rs-backend.onrender.com/api` |

### Como fazer o deploy
1. Conecte o repositório na [Vercel](https://vercel.com)
2. Adicione a variável de ambiente acima
3. A Vercel detecta o React automaticamente e faz o build

---

## Funcionalidades

- ✅ Listagem de abrigos aprovados com filtros
- ✅ Barra de ocupação visual por abrigo
- ✅ Tags de recursos (animais, PCD, alimentação, banheiro)
- ✅ Cadastro público de abrigos (com aviso de aprovação pendente)
- ✅ Estatísticas em tempo real na página inicial
- ✅ Lista de necessidades ordenada por urgência
- ✅ Login administrativo com JWT
- ✅ Painel admin completo (aprovar, editar, gerenciar necessidades)
- ✅ Menu responsivo com hamburguer para mobile
- ✅ Token salvo no localStorage com logout automático
