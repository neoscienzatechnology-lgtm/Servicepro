# 🚀 Início Rápido - ServiceFlow Pro

## ✅ Instalação Completa!

Todas as dependências foram instaladas com sucesso.

## 📋 Próximos Passos

### 1️⃣ Configurar MongoDB

Você precisa de um banco de dados MongoDB. Escolha uma opção:

**🌟 OPÇÃO RECOMENDADA - MongoDB Atlas (Grátis, Cloud):**
1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie conta gratuita
3. Crie um cluster gratuito (M0 Sandbox)
4. Configure usuário e senha
5. Permita acesso de qualquer IP (0.0.0.0/0)
6. Copie a connection string
7. Edite `backend\.env` e atualize `MONGODB_URI`

📖 **Veja o guia completo em:** `MONGODB_SETUP.md`

### 2️⃣ Executar o Sistema

**Opção A - Usar o script (mais fácil):**
```bash
start.bat
```

**Opção B - Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Opção C - Tudo junto:**
```bash
npm run dev
```

### 3️⃣ Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

### 4️⃣ Primeiro Acesso

1. Acesse http://localhost:3000
2. Clique em **"Registre-se"**
3. Crie sua conta admin:
   - Nome: Admin
   - Sobrenome: Sistema
   - Email: admin@serviceflow.com
   - Telefone: +5511999999999
   - Senha: 123456
4. Faça login e comece a usar!

---

## 🎯 Funcionalidades Principais

✅ **Dashboard** - Visão geral do negócio  
✅ **Agendamentos** - Gestão completa de serviços  
✅ **Clientes** - Cadastro e histórico  
✅ **Técnicos** - Controle de equipe  
✅ **Faturas** - Cobrança e pagamentos  
✅ **Serviços** - Catálogo de serviços  

---

## 🛠️ Estrutura do Projeto

```
Housecallpro/
├── backend/          # API Node.js (porta 5000)
│   ├── src/
│   │   ├── models/      # Modelos MongoDB
│   │   ├── controllers/ # Lógica de negócio
│   │   ├── routes/      # Rotas da API
│   │   └── server.ts    # Servidor
│   └── .env            # Configurações
│
├── frontend/         # React App (porta 3000)
│   ├── src/
│   │   ├── pages/       # Páginas
│   │   ├── components/  # Componentes
│   │   └── store/       # Estado
│   └── .env            # Configurações
│
├── start.bat         # Script de início
└── README.md         # Este arquivo
```

---

## 📚 Documentação

- **Instalação Completa:** `INSTALLATION.md`
- **API Documentation:** `API_DOCUMENTATION.md`
- **MongoDB Setup:** `MONGODB_SETUP.md`

---

## 🐛 Problemas Comuns

### Erro de conexão com MongoDB
- ✅ Verifique se configurou o MongoDB Atlas corretamente
- ✅ Confirme que a connection string está no `backend\.env`
- ✅ Verifique se permitiu acesso de qualquer IP no Atlas

### Porta já em uso
```powershell
# Matar processo na porta 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro de módulos
```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## 📞 Suporte

Consulte a documentação completa em `INSTALLATION.md`

---

## 🎉 Pronto para usar!

Execute `start.bat` e comece a gerenciar seus serviços profissionalmente!
