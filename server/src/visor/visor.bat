@echo off
setlocal
set "chromePath=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "edgePath=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
set "userDataDir=C:\chrome_dev"
set "indexPath=%~dp0index.html"

if exist "%chromePath%" (
    echo Usando Chrome...
    "%chromePath%" --disable-web-security --user-data-dir="%userDataDir%" "%indexPath%"
) else if exist "%edgePath%" (
    echo Chrome no encontrado, usando Edge...
    "%edgePath%" --disable-web-security --user-data-dir="%~dp0\edge_data" "%indexPath%"
) else (
    echo Ni Chrome ni Edge encontrados.
)
endlocal
