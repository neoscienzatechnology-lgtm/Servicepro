# Variáveis de Ambiente para Vercel

## Backend (serviceflow-backend)

Copie e cole estas variáveis no Vercel Dashboard > Settings > Environment Variables:

```
MONGODB_URI=mongodb+srv://neoscienzatechnology_db_user:XGnzM86XgbT4EoCR@cluster0.nbf3odo.mongodb.net/serviceflow?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mysecret123
JWT_EXPIRE=30d
NODE_ENV=production
FRONTEND_URL=https://serviceflow-frontend-nine.vercel.app
```

**IMPORTANTE:** Após obter a URL do frontend no Vercel, atualize `FRONTEND_URL` com a URL correta.

---

## Frontend (serviceflow-frontend)

Copie e cole esta variável no Vercel Dashboard > Settings > Environment Variables:

```
VITE_API_URL=https://serviceflow-backend.vercel.app/api
```

**IMPORTANTE:** Após obter a URL do backend no Vercel, atualize `VITE_API_URL` com a URL correta.

---

## MongoDB Atlas - Configuração Necessária

1. Acesse https://cloud.mongodb.com
2. Vá em **Network Access**
3. Clique em **Add IP Address**
4. Selecione **Allow Access from Anywhere** (0.0.0.0/0)
5. Salve

Isso permite que o Vercel acesse seu banco de dados.

---

## Ordem de Deploy Recomendada

1. **Deploy Backend primeiro** → Obtenha a URL
2. Atualize `VITE_API_URL` no frontend com a URL do backend
3. **Deploy Frontend** → Obtenha a URL
4. Atualize `FRONTEND_URL` no backend com a URL do frontend
5. Teste a aplicação!

---

## Connection String Atual

```
mongodb+srv://neoscienzatechnology_db_user:XGnzM86XgbT4EoCR@cluster0.mongodb.net/serviceflow?retryWrites=true&w=majority
```

**Se o cluster for diferente**, atualize `cluster0` pelo nome do seu cluster no Atlas.
