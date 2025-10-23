Write-Host "=== Supabase Function Tester ===" -ForegroundColor Cyan
Write-Host ""

$projectRef = Read-Host "Enter your Project Reference ID"
$anonKey = Read-Host "Enter your Anon Key"

$url = "https://$projectRef.supabase.co/functions/v1/create-employee"

$body = @{
    email = "test@example.com"
    full_name = "Test Employee"
    department = "Engineering"
    position = "Software Engineer"
    role = "employee"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $anonKey"
}

Write-Host ""
Write-Host "Testing function at: $url" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -Headers $headers
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
