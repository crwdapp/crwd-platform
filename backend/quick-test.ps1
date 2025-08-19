# Quick API Test
Write-Host "🧪 Quick API Test" -ForegroundColor Green

# Test Health
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "✅ Health: $($health | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test API Info
try {
    $api = Invoke-RestMethod -Uri "http://localhost:3000/api" -Method GET
    Write-Host "✅ API Info: $($api | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ API Info failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Bars (this will likely fail due to DB connection)
try {
    $bars = Invoke-RestMethod -Uri "http://localhost:3000/api/bars" -Method GET
    Write-Host "✅ Bars: $($bars | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Bars failed: $($_.Exception.Message)" -ForegroundColor Red
}
