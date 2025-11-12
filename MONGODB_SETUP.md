# 🗄️ Opções para MongoDB

## Opção 1: Usar MongoDB Atlas (Cloud) - **RECOMENDADO**

MongoDB Atlas é gratuito e não requer instalação local.

### Passos:

1. **Criar conta gratuita:**
   - Acesse: https://www.mongodb.com/cloud/atlas/register
   - Crie uma conta gratuita

2. **Criar um cluster:**
   - Clique em "Build a Database"
   - Escolha "M0 Sandbox" (FREE)
   - Selecione uma região próxima (ex: São Paulo)
   - Clique em "Create"

3. **Configurar acesso:**
   - **Security > Database Access**: 
     - Add New Database User
     - Username: `housecallpro`
     - Password: `housecallpro123` (ou outra senha)
     - User Privileges: Read and write to any database
   
   - **Security > Network Access**:
     - Add IP Address
     - Clique em "Allow Access from Anywhere" (0.0.0.0/0)
     - Confirm

4. **Obter Connection String:**
   - Clique em "Connect" no seu cluster
   - Escolha "Connect your application"
   - Copie a string de conexão
   - Exemplo: `mongodb+srv://housecallpro:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

5. **Atualizar `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://housecallpro:housecallpro123@cluster0.xxxxx.mongodb.net/housecallpro?retryWrites=true&w=majority
   ```
   **Importante:** Substitua `<password>` pela sua senha e `cluster0.xxxxx` pelo seu cluster.

---

## Opção 2: Instalar MongoDB Localmente

### Windows:

1. **Download:**
   - Acesse: https://www.mongodb.com/try/download/community
   - Baixe a versão Windows MSI

2. **Instalar:**
   - Execute o instalador
   - Escolha "Complete"
   - Marque "Install MongoDB as a Service"
   - Marque "Install MongoDB Compass" (GUI opcional)

3. **Verificar instalação:**
   ```powershell
   mongod --version
   ```

4. **Iniciar serviço:**
   ```powershell
   net start MongoDB
   ```

5. **Arquivo `.env` já está configurado:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/housecallpro
   ```

---

## Opção 3: Docker (Se tiver Docker instalado)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## ✅ Qual escolher?

- **MongoDB Atlas (Opção 1)**: Mais fácil, não precisa instalar nada
- **Local (Opção 2)**: Melhor para desenvolvimento offline
- **Docker (Opção 3)**: Se já usa Docker

**Recomendação:** Use MongoDB Atlas para começar rapidamente!
