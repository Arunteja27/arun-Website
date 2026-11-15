# Keep the gh-pages clone off the long OneDrive checkout path.
$previousCacheDir = $env:CACHE_DIR

Push-Location -LiteralPath $PSScriptRoot -ErrorAction Stop
try {
    $env:CACHE_DIR = 'C:\temp\arun-website-cache'
    npm.cmd run deploy
    if ($LASTEXITCODE -ne 0) {
        throw "GitHub Pages deployment exited with code $LASTEXITCODE."
    }
}
finally {
    Pop-Location
    $env:CACHE_DIR = $previousCacheDir
}
