# 🚀 Guia de Instalação e Execução - HouseCall Pro Clone

## Pré-requisitos

- **Node.js** v18 ou superior
- **MongoDB** v6 ou superior (local ou MongoDB Atlas)
- **npm** ou **yarn**
- **Git**

## 📥 Instalação

### 1. Clone o repositório (se aplicável)

```bash
git clone <seu-repositorio>
cd Housecallpro
```

### 2. Instale todas as dependências

```bash
npm run install-all
```

Ou instale manualmente:

```bash
# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

## ⚙️ Configuração

### 1. Configure o Backend

Crie o arquivo `.env` no diretório `backend`:

```bash
cd backend
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Linux/Mac
```

Edite o arquivo `.env` com suas credenciais:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/housecallpro
# Ou MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/housecallpro

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_secure
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Opcional - Para produção:
# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (Email)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourapp.com

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### 2. Configure o Frontend

Crie o arquivo `.env` no diretório `frontend`:

```bash
cd ../frontend
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Linux/Mac
```

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Inicie o MongoDB

**Localmente:**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# ou
sudo service mongod start
```

**MongoDB Atlas:**
- Certifique-se de que seu cluster está ativo
- Adicione seu IP à whitelist
- Use a connection string no arquivo `.env`

## 🏃 Execução

### Opção 1: Executar tudo de uma vez (Recomendado)

Na raiz do projeto:

```bash
npm run dev
```

Isso iniciará:
- Backend na porta `5000`
- Frontend na porta `3000`

### Opção 2: Executar separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 📱 Primeiro Acesso

1. Acesse http://localhost:3000
2. Clique em "Registre-se"
3. Preencha o formulário:
   - Nome: Admin
   - Sobrenome: Sistema
   - Email: admin@housecall.com
   - Telefone: +5511999999999
   - Senha: 123456
4. Faça login com as credenciais criadas

## 🔧 Scripts Disponíveis

### Raiz do projeto
```bash
npm run dev          # Executar backend e frontend
npm run install-all  # Instalar todas as dependências
```

### Backend
```bash
npm run dev      # Modo desenvolvimento
npm run build    # Compilar TypeScript
npm start        # Executar versão compilada
```

### Frontend
```bash
npm run dev      # Modo desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Verificar erros
```

## 🐛 Solução de Problemas

### Erro de conexão com MongoDB
```bash
# Verifique se o MongoDB está rodando
mongod --version

# Verifique a conexão
mongo --eval "db.version()"
```

### Porta já em uso
```bash
# Windows - Matar processo na porta 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Erro de módulos não encontrados
```bash
# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 📦 Build para Produção

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Os arquivos estarão em frontend/dist
```

## 🔐 Segurança

⚠️ **IMPORTANTE para Produção:**

1. **Altere o JWT_SECRET** para algo seguro e único
2. **Use HTTPS** em produção
3. **Configure CORS** adequadamente
4. **Use variáveis de ambiente** para dados sensíveis
5. **Não commite** arquivos `.env` no Git

## 📚 Estrutura de Pastas

```
Housecallpro/
├── backend/
│   ├── src/
│   │   ├── config/        # Configurações
│   │   ├── controllers/   # Controladores
│   │   ├── middleware/    # Middlewares
│   │   ├── models/        # Modelos MongoDB
│   │   ├── routes/        # Rotas da API
│   │   └── server.ts      # Entry point
│   ├── .env               # Variáveis de ambiente
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── services/      # API calls
│   │   ├── store/         # Estado global
│   │   └── App.tsx
│   ├── .env               # Variáveis de ambiente
│   └── package.json
│
└── README.md
```

## 🤝 Suporte

Para dúvidas e problemas, consulte a documentação ou abra uma issue.

## 📄 Licença

MIT
