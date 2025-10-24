#!/bin/bash

echo "�� Rhythm Game セットアップスクリプト"
echo "======================================"

# Node.jsのバージョン確認
echo ""
echo "📋 Node.jsのバージョンを確認中..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません"
    echo "README.mdを参照してNode.jsをインストールしてください"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

# npmのバージョン確認
NPM_VERSION=$(npm --version)
echo "✅ npm: $NPM_VERSION"

# 依存関係のインストール
echo ""
echo "📦 依存パッケージをインストール中..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ 依存パッケージのインストール完了"
else
    echo "❌ インストールに失敗しました"
    exit 1
fi

# ディレクトリの確認
echo ""
echo "📁 必要なディレクトリを確認中..."
mkdir -p public/models
mkdir -p public/audio
mkdir -p public/charts
mkdir -p docs
echo "✅ ディレクトリの確認完了"

# VRMモデルの確認
echo ""
echo "🎭 VRMモデルの確認..."
if [ -f "public/models/test-game.vrm" ]; then
    echo "✅ VRMモデルが見つかりました"
else
    echo "⚠️  VRMモデルが見つかりません"
    echo "   public/models/test-game.vrm を配置してください"
    echo "   詳細は README.md を参照してください"
fi

# 音楽ファイルの確認
echo ""
echo "🎵 音楽ファイルの確認..."
AUDIO_COUNT=$(ls -1 public/audio/*.mp3 2>/dev/null | wc -l)
if [ $AUDIO_COUNT -gt 0 ]; then
    echo "✅ 音楽ファイルが $AUDIO_COUNT 個見つかりました"
else
    echo "⚠️  音楽ファイルが見つかりません"
    echo "   public/audio/*.mp3 を配置してください"
    echo "   詳細は README.md を参照してください"
fi

echo ""
echo "======================================"
echo "✅ セットアップ完了！"
echo ""
echo "開発サーバーを起動するには:"
echo "  npm run dev"
echo ""
echo "ブラウザで以下にアクセス:"
echo "  http://localhost:9059"
echo "======================================"
