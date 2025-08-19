# Comprehensive API Testing Script
Write-Host "🧪 Testing CRWD Bolt Backend API - All Endpoints" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Test Health Endpoint
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "✅ Health Check: $($healthResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test API Info Endpoint
Write-Host "`n2. Testing API Info Endpoint..." -ForegroundColor Yellow
try {
    $apiInfoResponse = Invoke-RestMethod -Uri "http://localhost:3000/api" -Method GET
    Write-Host "✅ API Info: $($apiInfoResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ API Info Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Bars Endpoint
Write-Host "`n3. Testing Bars Endpoint..." -ForegroundColor Yellow
try {
    $barsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/bars?limit=5&offset=0" -Method GET
    Write-Host "✅ Bars Response: $($barsResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Bars Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Events Endpoint
Write-Host "`n4. Testing Events Endpoint..." -ForegroundColor Yellow
try {
    $eventsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/events?limit=5&offset=0" -Method GET
    Write-Host "✅ Events Response: $($eventsResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Events Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test User Creation
Write-Host "`n5. Testing User Creation..." -ForegroundColor Yellow
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

# Test Bar Creation (if we have a user)
Write-Host "`n6. Testing Bar Creation..." -ForegroundColor Yellow
try {
    $barData = @{
        name = "Test Bar"
        description = "A test bar for API testing"
        address = "123 Test St, Test City"
        lat = 40.7128
        lng = -74.0060
        phone = "+1234567890"
        priceRange = "$$"
        images = @("https://via.placeholder.com/400x300")
        tags = @("test", "api")
        type = "Test Bar"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $barResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/bars" -Method POST -Body $barData -Headers $headers
    Write-Host "✅ Bar Created: $($barResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Bar Creation Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
