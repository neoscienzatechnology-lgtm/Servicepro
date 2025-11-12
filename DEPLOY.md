# ServiceFlow Pro - Guia de Deploy

## Deploy Gratuito (Vercel + MongoDB Atlas)

### Passo 1: MongoDB Atlas (Banco de Dados Grátis)

1. Acesse https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um cluster M0 (Free Tier)
4. Em "Database Access", crie um usuário com senha
5. Em "Network Access", adicione `0.0.0.0/0` (permite de qualquer IP)
6. Clique em "Connect" → "Connect your application"
7. Copie a connection string (ex: `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/serviceflow`)

### Passo 2: Criar Repositório no GitHub

```powershell
cd c:\Users\PC\Documents\Housecallpro
git add .
git commit -m "Initial commit - ServiceFlow Pro"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/serviceflow-pro.git
git push -u origin main
```

### Passo 3: Deploy do Backend no Vercel

1. Acesse https://vercel.com e faça login com GitHub
2. Clique em "Add New Project"
3. Importe o repositório `serviceflow-pro`
4. Configure:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Adicione as variáveis de ambiente:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/serviceflow
   JWT_SECRET=seu-secret-super-seguro-aqui-123
   JWT_EXPIRE=30d
   NODE_ENV=production
   FRONTEND_URL=https://seu-frontend.vercel.app
   ```

6. Clique em "Deploy"
7. Anote a URL do backend (ex: `https://serviceflow-backend.vercel.app`)

### Passo 4: Deploy do Frontend no Vercel

1. No Vercel, clique em "Add New Project" novamente
2. Importe o mesmo repositório
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Adicione as variáveis de ambiente:
   ```
   VITE_API_URL=https://serviceflow-backend.vercel.app
   ```

5. Clique em "Deploy"

### Passo 5: Popular com Dados de Demonstração

Após o deploy, execute o seed remotamente:

```powershell
# Criar um script temporário para executar seed via API
curl -X POST https://serviceflow-backend.vercel.app/api/seed
```

Ou acesse a aplicação e crie manualmente um usuário admin.

### Login de Teste

Após popular os dados:
- **Email**: admin@serviceflow.com
- **Senha**: 123456

---

## URLs Finais

- **Frontend**: https://serviceflow-pro.vercel.app
- **Backend**: https://serviceflow-backend.vercel.app
- **API Health**: https://serviceflow-backend.vercel.app/health

---

## Comandos Úteis para Desenvolvimento Local

```powershell
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Suporte

Em caso de dúvidas ou problemas no deploy, verifique:
- Logs no dashboard do Vercel
- Conexão com MongoDB Atlas (IP whitelisted)
- Variáveis de ambiente configuradas corretamente
