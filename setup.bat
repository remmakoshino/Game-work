@echo off
echo 🎵 Rhythm Game セットアップスクリプト
echo ======================================

echo.
echo 📋 Node.jsのバージョンを確認中...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.jsがインストールされていません
    echo README.mdを参照してNode.jsをインストールしてください
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js: %NODE_VERSION%

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm: %NPM_VERSION%

echo.
echo 📦 依存パッケージをインストール中...
call npm install

if %errorlevel% neq 0 (
    echo ❌ インストールに失敗しました
    pause
    exit /b 1
)
echo ✅ 依存パッケージのインストール完了

echo.
echo 📁 必要なディレクトリを確認中...
if not exist "public\models" mkdir public\models
if not exist "public\audio" mkdir public\audio
if not exist "public\charts" mkdir public\charts
if not exist "docs" mkdir docs
echo ✅ ディレクトリの確認完了

echo.
echo 🎭 VRMモデルの確認...
if exist "public\models\test-game.vrm" (
    echo ✅ VRMモデルが見つかりました
) else (
    echo ⚠️  VRMモデルが見つかりません
    echo    public\models\test-game.vrm を配置してください
    echo    詳細は README.md を参照してください
)

echo.
echo 🎵 音楽ファイルの確認...
dir /b public\audio\*.mp3 >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%A in ('dir /b public\audio\*.mp3 ^| find /c /v ""') do set AUDIO_COUNT=%%A
    echo ✅ 音楽ファイルが !AUDIO_COUNT! 個見つかりました
) else (
    echo ⚠️  音楽ファイルが見つかりません
    echo    public\audio\*.mp3 を配置してください
    echo    詳細は README.md を参照してください
)

echo.
echo ======================================
echo ✅ セットアップ完了！
echo 開発サーバーを起動するには:
echo   npm run dev
echo.
echo ブラウザで以下にアクセス:
echo   http://localhost:9059
echo ======================================
pause
