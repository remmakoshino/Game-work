# 🚀 クイックスタートガイド

このガイドでは、最短でゲームを起動する方法を説明します。

## ⚡ 5分でスタート

### 1. リポジトリをクローン
```bash
git clone https://github.com/YOUR_USERNAME/Game-work.git
cd Game-work
```

### 2. セットアップスクリプトを実行

**Linux/Mac:**
```bash
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

### 3. VRMモデルを配置

**最も簡単な方法**: VRoid Studioを使用

1. [VRoid Studio](https://vroid.com/studio) をダウンロード
2. アプリを開いて新規キャラクターを作成
3. 「エクスポート」→「VRMエクスポート」
4. `test-game.vrm` として保存
5. `public/models/` フォルダに移動

**または**: [VRoid Hub](https://hub.vroid.com/) から既存モデルをダウンロード

### 4. 音楽ファイルを配置

1. MP3ファイルを3つ用意（フリー素材サイトから）
2. `song1.mp3`, `song2.mp3`, `song3.mp3` にリネーム
3. `public/audio/` フォルダに配置

### 5. 起動！
```bash
npm run dev
```

ブラウザで `http://localhost:9059` を開く

## 🎮 すぐに試したい場合

VRMモデルと音楽がなくても、コードは動作確認できます：

1. VRMモデルなしでも起動可能（キャラクターは表示されません）
2. 音楽なしでもゲームプレイ可能（無音でプレイ）

後から追加すれば反映されます。

## 📝 次のステップ

- [README.md](README.md) - 詳細なドキュメント
- [CONTRIBUTING.md](CONTRIBUTING.md) - 開発に参加する

## ❓ 困ったら

- [Issues](https://github.com/YOUR_USERNAME/Game-work/issues) で質問
- [Discussions](https://github.com/YOUR_USERNAME/Game-work/discussions) でディスカッション
