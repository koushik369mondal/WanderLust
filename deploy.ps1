# Render Deploy Script for Windows PowerShell
# Usage: .\deploy.ps1

Write-Host "🚀 Starting Render deployment..." -ForegroundColor Green

# Check if RENDER_API_KEY is set
$apiKey = $env:RENDER_API_KEY
if (-not $apiKey) {
    Write-Host "❌ Error: RENDER_API_KEY environment variable is not set" -ForegroundColor Red
    Write-Host "Please set it with: `$env:RENDER_API_KEY = 'your_api_key'" -ForegroundColor Yellow
    exit 1
}

$serviceId = "srv-d0971eeuk2gs73a2m2og"
$uri = "https://api.render.com/v1/services/$serviceId/deploys"

Write-Host "📝 Triggering deployment for service: $serviceId" -ForegroundColor Blue

try {
    # Trigger deployment
    $headers = @{
        "Authorization" = "Bearer $apiKey"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers
    
    Write-Host "📋 Render API Response:" -ForegroundColor Blue
    $response | ConvertTo-Json -Depth 10
    
    if ($response.id) {
        Write-Host "✅ Deployment triggered successfully!" -ForegroundColor Green
        Write-Host "Deploy ID: $($response.id)" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error triggering deployment: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
