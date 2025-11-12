# 🚀 ServiceFlow Pro - Deploy Final

## 🌐 URLs de Produção

**Frontend:** https://serviceflow-frontend-nine.vercel.app/login  
**Backend API:** https://serviceflow-backend.vercel.app

---

## 🔑 Credenciais de Acesso

### **Administrador**
- Email: `admin@serviceflow.com`
- Senha: `123456`

### **Técnicos**
- Email: `joao@serviceflow.com` | Senha: `123456`
- Email: `maria@serviceflow.com` | Senha: `123456`

---

## ⚙️ Configuração Final no Vercel

### **Frontend (serviceflow-frontend-nine)**

Settings → Environment Variables:

```
VITE_API_URL=https://serviceflow-backend.vercel.app/api
```

### **Backend (serviceflow-backend-6b6b3pv8r)**

Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://neoscienzatechnology_db_user:XGnzM86XgbT4EoCR@cluster0.nbf3odo.mongodb.net/serviceflow?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=serviceflow_pro_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=30d
NODE_ENV=production
FRONTEND_URL=https://serviceflow-frontend-nine.vercel.app
```

---

## 📊 Dados de Demonstração

✅ **1 Empresa** - ServiceFlow Pro Demo  
✅ **3 Usuários** - 1 admin + 2 técnicos  
✅ **3 Clientes** - Carlos Oliveira, Ana Costa, Pedro Souza  
✅ **3 Serviços** - Manutenção de Ar Condicionado (R$150), Instalação de Ventilador (R$80), Reparo de Aquecedor (R$200)  
✅ **2 Técnicos** - João Silva (Ar Condicionado/Ventilação), Maria Santos (Aquecimento/Ar Condicionado)  
✅ **2 Agendamentos** - 1 para amanhã às 09:00, 1 para próxima semana às 14:00  
✅ **2 Faturas** - 1 pendente (R$150), 1 paga (R$80)

---

## 🔄 Re-popular Banco de Dados (se necessário)

Se precisar resetar os dados de demonstração:

```bash
cd backend
npx ts-node src/seed-production.ts
```

---

## 📝 Próximos Passos (Opcional)

1. **Domínio Customizado:** Configure um domínio próprio no Vercel (Settings → Domains)
2. **Segurança:** Troque `JWT_SECRET` por um valor mais seguro
3. **Monitoramento:** Configure alertas no Vercel para monitorar uptime
4. **Analytics:** Adicione Google Analytics ou similar

---

## ✅ Checklist de Apresentação ao Cliente

- [ ] Testar login com credenciais de admin
- [ ] Mostrar dashboard com estatísticas
- [ ] Demonstrar criação de novo cliente
- [ ] Demonstrar agendamento de serviço
- [ ] Mostrar calendário de appointments
- [ ] Demonstrar geração de fatura
- [ ] Mostrar relatórios

**Tudo pronto para a apresentação! 🎉**
