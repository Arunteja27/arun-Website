Write-Host "Creating temporary deployment directory..." -ForegroundColor Green

$gitRemote = git config --get remote.origin.url

$tempDir = "C:\temp\deploy-$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    Write-Host "Copying project files to temporary location..." -ForegroundColor Yellow
    
    # Copy essential files
    Copy-Item "package.json" "$tempDir\"
    Copy-Item "package-lock.json" "$tempDir\"
    Copy-Item "vite.config.js" "$tempDir\"
    Copy-Item "index.html" "$tempDir\"
    Copy-Item ".eslintrc.cjs" "$tempDir\"
    Copy-Item -Recurse "src" "$tempDir\"
    Copy-Item -Recurse "public" "$tempDir\"
    
    Set-Location $tempDir
    
    Write-Host "Setting up git..." -ForegroundColor Yellow
    git init
    git remote add origin $gitRemote
    
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "Building and deploying..." -ForegroundColor Yellow
    npm run deploy
    
    Write-Host "Deployment successful!" -ForegroundColor Green
}
catch {
    Write-Host "Deployment failed: $_" -ForegroundColor Red
}
finally {
    Set-Location $PSScriptRoot
    
    if (Test-Path $tempDir) {
        Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
    }
}

Write-Host "Script completed." -ForegroundColor Green 