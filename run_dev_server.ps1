# ==========================================================================
# GASTROINOVA - SERVIDOR DE DESARROLLO NATIVO (.NET / POWERSHELL)
# Ejecuta este script para ver la web localmente en http://localhost:3000
# sin requerir ninguna instalacion de Node, Python o NPM.
# ==========================================================================

$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "`n==================================================" -ForegroundColor Green
    Write-Host "  Servidor de Desarrollo de Gastroinova Iniciado" -ForegroundColor Green
    Write-Host "  Dirección: http://localhost:$port/" -ForegroundColor Cyan
    Write-Host "  Para detener el servidor, cierra esta ventana" -ForegroundColor White
    Write-Host "  o presiona Ctrl+C en esta consola de comandos." -ForegroundColor Yellow
    Write-Host "==================================================`n" -ForegroundColor Green

    # Intentar abrir el navegador por defecto automáticamente
    try {
        Start-Process "http://localhost:$port/"
    } catch {
        Write-Host "Por favor, abre manualmente http://localhost:$port/ en tu navegador." -ForegroundColor Gray
    }

    # Escuchar peticiones en bucle
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        # Limpiar la ruta y convertirla a formato local
        $urlPath = $urlPath.Replace("/", "\")
        $filePath = Join-Path (Get-Location).Path $urlPath

        # Comprobar si el archivo existe y es un fichero regular
        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mimeType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".svg"  { "image/svg+xml; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".json" { "application/json; charset=utf-8" }
                default { "application/octet-stream" }
            }

            try {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $mimeType
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $errMsg = [System.Text.Encoding]::UTF8.GetBytes("<h1>500 Error Interno del Servidor</h1><p>$($_.Exception.Message)</p>")
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $errMsg.Length
                $response.OutputStream.Write($errMsg, 0, $errMsg.Length)
            }
        } else {
            # 404 No Encontrado
            $response.StatusCode = 404
            $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Archivo No Encontrado</h1><p>El archivo $urlPath no existe en la carpeta del proyecto.</p>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $notFoundMsg.Length
            $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error crítico al iniciar el servidor: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    Write-Host "`nServidor detenido." -ForegroundColor Yellow
}
