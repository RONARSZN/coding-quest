param([switch]$NoBrowser)

$ErrorActionPreference = 'Stop'
$questUrl = 'http://127.0.0.1:5188/'
$questAppPath = $PSScriptRoot

function Test-QuestServer {
    try {
        $response = Invoke-WebRequest -Uri $questUrl -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -eq 200 -and $response.Content -match '<title>Coding Quest(?:\s|<)'
    } catch {
        return $false
    }
}

try {
    if (-not (Test-QuestServer)) {
        $questVitePath = Join-Path $questAppPath 'node_modules\vite\bin\vite.js'
        $questBuildPath = Join-Path $questAppPath 'dist\index.html'
        if (-not (Test-Path -LiteralPath $questVitePath) -or -not (Test-Path -LiteralPath $questBuildPath)) {
            throw 'Coding Quest needs setup. Run launch.cmd in the app folder first.'
        }

        $questNodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
        $questNodePath = if ($questNodeCommand) { $questNodeCommand.Source } else { 'D:\Codex\tools\node-root\node.exe' }
        if (-not (Test-Path -LiteralPath $questNodePath)) {
            throw 'Node.js could not be found. Install Node.js or restore the Codex Node runtime.'
        }

        $questOutputPath = Join-Path $questAppPath 'output'
        New-Item -ItemType Directory -Path $questOutputPath -Force | Out-Null
        $questArguments = @('--max-old-space-size=384', '--max-semi-space-size=2', ('"' + $questVitePath + '"'), 'preview', '--host', '127.0.0.1', '--port', '5188', '--strictPort')
        Start-Process -FilePath $questNodePath -ArgumentList $questArguments -WorkingDirectory $questAppPath -WindowStyle Hidden -RedirectStandardOutput (Join-Path $questOutputPath 'desktop-preview.log') -RedirectStandardError (Join-Path $questOutputPath 'desktop-preview-error.log') | Out-Null

        $questDeadline = (Get-Date).AddSeconds(20)
        do {
            Start-Sleep -Milliseconds 300
            $questReady = Test-QuestServer
        } until ($questReady -or (Get-Date) -ge $questDeadline)
        if (-not $questReady) {
            throw 'Coding Quest could not start on port 5188. See output\desktop-preview-error.log in the app folder.'
        }
    }

    if (-not $NoBrowser) {
        Start-Process -FilePath $questUrl
    }
} catch {
    if ($NoBrowser) { throw }
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, 'Coding Quest', 'OK', 'Error') | Out-Null
    exit 1
}
