# Test API Endpoints
Write-Host "🧪 Testing CRWD Bolt Backend API..." -ForegroundColor Green

# Test Health Endpoint
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "✅ Health Check: $($healthResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Users Endpoint
Write-Host "`n2. Testing Users Endpoint..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET
    Write-Host "✅ Users Response: $($usersResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Users Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Bars Endpoint
Write-Host "`n3. Testing Bars Endpoint..." -ForegroundColor Yellow
try {
    $barsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/bars" -Method GET
    Write-Host "✅ Bars Response: $($barsResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Bars Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Events Endpoint
Write-Host "`n4. Testing Events Endpoint..." -ForegroundColor Yellow
try {
    $eventsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/events" -Method GET
    Write-Host "✅ Events Response: $($eventsResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Events Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
