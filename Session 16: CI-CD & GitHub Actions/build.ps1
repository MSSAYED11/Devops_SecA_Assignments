$buildDir = "build"
if (Test-Path $buildDir) { Remove-Item -Recurse -Force $buildDir }
New-Item -ItemType Directory -Force -Path $buildDir | Out-Null
Copy-Item "app\calculator.py" -Destination $buildDir
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$info = "Build Timestamp: $timestamp`nVersion: 1.0.0`nStatus: SUCCESS"
Set-Content -Path "$buildDir\build-info.txt" -Value $info
Write-Output "Build complete! Artifacts created in build/"
Get-ChildItem -Path $buildDir
