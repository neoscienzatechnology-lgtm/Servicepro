$body = @{
    firstName = "Admin"
    lastName = "Teste"
    email = "admin@teste.com"
    password = "123456"
    phone = "+5511999999999"
    role = "admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Usuário criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📧 Email: admin@teste.com" -ForegroundColor Cyan
    Write-Host "🔑 Senha: 123456" -ForegroundColor Cyan
    Write-Host "👤 Role: admin" -ForegroundColor Cyan
    Write-Host ""
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Erro ao criar usuário:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}
