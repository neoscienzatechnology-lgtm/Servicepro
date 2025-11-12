@echo off
echo ========================================
echo  ServiceFlow Pro - Sistema de Gestao
echo ========================================
echo.
echo Verificando MongoDB...
echo.

REM Verificar se MongoDB esta rodando (Atlas nao precisa)
echo Se voce esta usando MongoDB Atlas, ignore avisos sobre MongoDB local.
echo.

echo Iniciando Backend (porta 5000)...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo Iniciando Frontend (porta 3000)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Aplicacao iniciada!
echo ========================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo  Health:   http://localhost:5000/health
echo.
echo Pressione qualquer tecla para sair...
pause > nul
