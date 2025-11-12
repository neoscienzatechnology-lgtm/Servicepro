# ServiceFlow Pro - Sistema de Gestão para Profissionais de Serviços

> ✅ **Sistema completo e funcional!** Todas as dependências foram instaladas.

## 🎯 Início Rápido

**Veja o guia completo:** [`QUICKSTART.md`](QUICKSTART.md)

1. Configure MongoDB Atlas (grátis) - veja `MONGODB_SETUP.md`
2. Execute `start.bat` ou `npm run dev`
3. Acesse http://localhost:3000

## 🚀 Funcionalidades Principais

### 📋 Gestão de Clientes
- Cadastro completo de clientes com histórico
- Múltiplos endereços e contatos por cliente
- Notas e tags personalizadas
- Histórico de serviços realizados

### 📅 Agendamento Inteligente
- Calendário interativo com drag-and-drop
- Visualização por dia/semana/mês
- Atribuição automática de técnicos
- Rotas otimizadas
- Lembretes automáticos por SMS e email
- Confirmação de agendamento

### 👷 Gestão de Técnicos
- Perfis de técnicos com especialidades
- Rastreamento GPS em tempo real
- Disponibilidade e horários
- Performance e métricas
- Check-in/check-out automático

### 💰 Faturamento e Pagamentos
- Criação de estimativas e orçamentos
- Geração automática de faturas
- Múltiplas formas de pagamento
- Processamento de cartão de crédito
- Pagamentos recorrentes
- Relatórios financeiros

### 📱 Aplicativo Mobile
- App para técnicos em campo
- Acesso offline
- Captura de fotos e assinaturas
- Atualização de status em tempo real
- GPS e navegação

### 📊 Relatórios e Analytics
- Dashboard com métricas principais
- Relatórios de receita
- Performance de técnicos
- Taxa de conversão
- Análise de serviços

### 🔔 Notificações
- SMS automáticos
- Emails personalizados
- Notificações push
- Lembretes de pagamento

### 🔐 Segurança
- Autenticação JWT
- Controle de acesso por roles
- Criptografia de dados sensíveis
- Logs de auditoria

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (real-time)
- Bull (job queue)
- Nodemailer (emails)
- Twilio (SMS)
- Stripe (pagamentos)

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router v6
- React Query
- Zustand (state management)
- FullCalendar
- React Hook Form
- Zod (validação)
- Recharts (gráficos)

### Mobile
- React Native
- Expo
- React Navigation

## 📦 Instalação

```bash
# Instalar todas as dependências
npm run install-all

# Configurar variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Iniciar em modo desenvolvimento
npm run dev
```

## 🔧 Configuração

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/housecallpro
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Twilio (SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# SendGrid (Email)
SENDGRID_API_KEY=

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_GOOGLE_MAPS_API_KEY=
```

## 📱 Estrutura do Projeto

```
housecallpro/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── mobile/
│   └── (React Native app)
└── package.json
```

## 🚀 Deploy

### Backend (Railway/Render)
```bash
cd backend
npm run build
npm start
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

## 📄 Licença

MIT
