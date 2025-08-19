# Detailed API Testing
Write-Host "🧪 Detailed CRWD Bolt Backend API Testing..." -ForegroundColor Green

# Test Health Endpoint
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "✅ Health Check: $($healthResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Bars Endpoint with proper query parameters
Write-Host "`n2. Testing Bars Endpoint with query params..." -ForegroundColor Yellow
try {
    $barsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/bars?limit=5&offset=0" -Method GET
    Write-Host "✅ Bars Response: $($barsResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Bars Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

# Test Events Endpoint with proper query parameters
Write-Host "`n3. Testing Events Endpoint with query params..." -ForegroundColor Yellow
try {
    $eventsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/events?limit=5&offset=0" -Method GET
    Write-Host "✅ Events Response: $($eventsResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Events Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

# Test creating a user
Write-Host "`n4. Testing User Creation..." -ForegroundColor Yellow
try {
    $userData = @{
        email = "test@example.com"
        name = "Test User"
        avatar = "https://via.placeholder.com/150"
        phone = "+1234567890"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $userResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -Body $userData -Headers $headers
    Write-Host "✅ User Created: $($userResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ User Creation Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Detailed API Testing Complete!" -ForegroundColor Green
