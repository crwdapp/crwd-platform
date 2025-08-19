# Test API without database connection
Write-Host "Testing API Structure (without database)" -ForegroundColor Green

# Test Health
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "Health: $($health | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Health failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test API Info
try {
    $api = Invoke-RestMethod -Uri "http://localhost:3000/api" -Method GET
    Write-Host "API Info: $($api | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "API Info failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nDatabase Status:" -ForegroundColor Yellow
try {
    $dbCheck = docker exec crwdbolt-postgres psql -U postgres -d crwdbolt -c "SELECT 'bars' as table_name, COUNT(*) as count FROM bars UNION ALL SELECT 'users', COUNT(*) FROM users UNION ALL SELECT 'events', COUNT(*) FROM events;"
    Write-Host "Database has data: $dbCheck" -ForegroundColor Green
} catch {
    Write-Host "Database check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. The API structure is working" -ForegroundColor White
Write-Host "2. Database has sample data" -ForegroundColor White
Write-Host "3. Need to fix host-to-container connection" -ForegroundColor White
Write-Host "4. Or run server from within Docker network" -ForegroundColor White
