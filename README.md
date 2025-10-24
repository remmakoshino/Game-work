# 🎵 Rhythm Game - アイドル音ゲー

VRMキャラクターと一緒に楽しむ本格的なリズムゲーム！  
ピンクツインテールの女の子が歌って踊る、アイドル風音ゲーです。

![Game Screenshot](./docs/screenshot.png)

## ✨ 特徴

- 🎭 **VRMモデル対応** - 3Dアイドルキャラクターが歌って踊る
- 🎮 **本格的なゲームプレイ** - 3段階判定システム（GREAT/GOOD/NORMAL）
- 🎨 **多彩なアニメーション** - ダンス、ジャンプ、回転、ウィンク、口パク
- 🚶‍♀️ **ダイナミックな動き** - ステージを歩いたり走ったりする演出
- 🎵 **複数楽曲対応** - 楽曲選択システム
- 🏆 **難易度選択** - EASY / NORMAL / HARD
- 💾 **ハイスコア保存** - ローカルストレージでスコア記録
- 🎊 **フルコンボ演出** - 完全クリア時の特別エフェクト

## 🎬 デモ

[ゲームプレイ動画](./docs/gameplay.gif)

## 📋 目次

- [必要要件](#必要要件)
- [インストール手順](#インストール手順)
  - [Node.js のインストール](#nodejs-のインストール)
  - [プロジェクトのセットアップ](#プロジェクトのセットアップ)
- [VRMモデルの準備](#vrmモデルの準備)
- [音楽ファイルの準備](#音楽ファイルの準備)
- [使い方](#使い方)
- [カスタマイズ](#カスタマイズ)
- [プロジェクト構成](#プロジェクト構成)
- [トラブルシューティング](#トラブルシューティング)
- [ライセンス](#ライセンス)

## 🔧 必要要件

- Node.js 18.x 以上
- npm 9.x 以上
- モダンなWebブラウザ（Chrome, Firefox, Edge推奨）

## 📦 インストール手順

### Node.js のインストール

#### Windows

1. **Node.js公式サイトからダウンロード**
   ```
   https://nodejs.org/
   ```
   LTS版（推奨版）をダウンロードしてインストール

2. **インストール確認**
   ```bash
   # コマンドプロンプトまたはPowerShellで実行
   node --version
   npm --version
   ```

#### macOS

**方法1: 公式インストーラー**
```bash
# https://nodejs.org/ からLTS版をダウンロードしてインストール
```

**方法2: Homebrewを使用**
```bash
# Homebrewのインストール（未インストールの場合）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.jsのインストール
brew install node

# 確認
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
# Node.jsの最新LTSをインストール
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 確認
node --version
npm --version
```

#### Linux (Fedora/RHEL/CentOS)

```bash
# Node.jsの最新LTSをインストール
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo dnf install -y nodejs

# 確認
node --version
npm --version
```

#### Linux (Arch Linux)

```bash
# Node.jsのインストール
sudo pacman -S nodejs npm

# 確認
node --version
npm --version
```

### プロジェクトのセットアップ

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Game-work.git
   cd Game-work
   ```

2. **依存パッケージのインストール**
   ```bash
   npm install
   ```

   これにより以下のパッケージがインストールされます：
   - React 18.x
   - Three.js
   - @react-three/fiber
   - @react-three/drei
   - @pixiv/three-vrm
   - Vite

3. **ディレクトリ構成の確認**
   ```bash
   # 必要なディレクトリが存在することを確認
   ls -la public/models
   ls -la public/audio
   ```

## 🎭 VRMモデルの準備

ゲームで使用するキャラクターのVRMモデルを用意します。

### VRMモデルの作成方法

1. **VRoid Studioのダウンロード**
   ```
   https://vroid.com/studio
   ```
   無料の3Dキャラクター作成ソフト

2. **キャラクターの作成**
   - VRoid Studioを起動
   - 新規キャラクターを作成
   - 以下のように設定（推奨）：
     - 髪型: ピンク色のツインテール
     - 服装: ミニスカートの制服
     - 体型: 8等身で脚が長いスタイル

3. **VRMファイルのエクスポート**
   - 「エクスポート」→「VRMエクスポート」
   - ファイル名: `test-game.vrm`
   - 保存先: プロジェクトの `public/models/` フォルダ

4. **配置**
   ```bash
   # VRMファイルを配置
   cp /path/to/your/test-game.vrm public/models/test-game.vrm
   ```

### 既存のVRMモデルを使用する場合

- [VRoid Hub](https://hub.vroid.com/) から利用可能なモデルをダウンロード
- 利用規約を必ず確認してください
- ダウンロードしたVRMファイルを `public/models/test-game.vrm` として配置

## 🎵 音楽ファイルの準備

### 音楽ファイルの用意

1. **対応フォーマット**: MP3形式
2. **推奨仕様**:
   - ビットレート: 192kbps以上
   - サンプリングレート: 44.1kHz
   - 曲の長さ: 30秒〜2分程度

3. **配置**
   ```bash
   # MP3ファイルを配置（例）
   cp /path/to/your/song1.mp3 public/audio/song1.mp3
   cp /path/to/your/song2.mp3 public/audio/song2.mp3
   cp /path/to/your/song3.mp3 public/audio/song3.mp3
   ```

### フリー音楽素材サイト（例）

- [DOVA-SYNDROME](https://dova-s.jp/)
- [魔王魂](https://maou.audio/)
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)

**注意**: 各サイトの利用規約を必ず確認してください。

### 譜面データの作成

音楽に合わせて譜面データを調整する場合：

```bash
# 譜面ファイルを編集
nano src/charts/song1-easy.json
```

譜面データの構造：
```json
{
  "id": "song1-easy",
  "title": "楽曲名",
  "artist": "アーティスト名",
  "bpm": 120,
  "difficulty": "EASY",
  "duration": 45000,
  "notes": [
    { "time": 2000, "lane": 0 },
    { "time": 2500, "lane": 1 }
  ]
}
```

- `time`: ノーツが出現するタイミング（ミリ秒）
- `lane`: レーン番号（0〜3: D, F, J, Kキーに対応）

## 🚀 使い方

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:9059` にアクセス

### 本番ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` フォルダに生成されます。

### ビルドのプレビュー

```bash
npm run preview
```

## 🎮 ゲームの遊び方

1. **メニュー画面**: 「START」ボタンをクリック
2. **楽曲選択**: 好きな楽曲と難易度を選択
3. **ゲーム開始**: スペースキーを押してスタート
4. **プレイ**: D / F / J / K キーでノーツをタイミングよくヒット
5. **判定**:
   - **GREAT**: ±50ms（金色）
   - **GOOD**: ±100ms（緑色）
   - **NORMAL**: ±150ms（青色）
   - **MISS**: それ以外（赤色）
6. **リザルト**: スコア確認とリトライ

## 🎨 カスタマイズ

### キャラクターのアニメーション調整

`src/components/Character3D.jsx` で調整可能：

```javascript
// ジャンプの高さ
return baseY + Math.sin(jumpProgress * Math.PI) * 0.5  // 0.5 → 0.7

// 移動範囲
animState.targetX = -2.5  // 左端
animState.targetX = 2.5   // 右端

// 移動頻度
const movementInterval = 6.0  // 秒数
```

### 楽曲の追加

1. 譜面データを作成（`src/charts/`）
2. `src/data/songList.js` に楽曲情報を追加

```javascript
{
  id: 'song4',
  title: '新しい楽曲',
  artist: 'アーティスト名',
  bpm: 140,
  image: '🎸',
  difficulties: {
    EASY: song4Easy,
    NORMAL: song4Normal,
    HARD: song4Hard
  }
}
```

### 判定タイミングの調整

`src/utils/constants.js`:

```javascript
export const JUDGMENT = {
  GREAT: 50,   // ±50ms → 厳しくする場合は小さく
  GOOD: 100,   // ±100ms
  NORMAL: 150  // ±150ms
}
```

## 📁 プロジェクト構成

```
Game-work/
├── index.html              # メインHTMLファイル
├── package.json            # npm設定
├── vite.config.js          # Vite設定
├── .gitignore             # Git除外設定
├── README.md              # このファイル
├── public/
│   ├── models/            # VRMモデル（.gitignore対象）
│   │   └── test-game.vrm
│   ├── audio/             # 音楽ファイル（.gitignore対象）
│   │   ├── song1.mp3
│   │   ├── song2.mp3
│   │   └── song3.mp3
│   └── charts/
│       └── sample-chart.json
├── src/
│   ├── index.jsx          # エントリーポイント
│   ├── App.jsx            # メインアプリ
│   ├── components/
│   │   ├── Character3D.jsx      # 3Dキャラクター
│   │   ├── GameScene.jsx        # ゲーム画面
│   │   ├── SongSelect.jsx       # 楽曲選択
│   │   └── ResultScreen.jsx     # リザルト画面
│   ├── game/
│   │   ├── JudgmentSystem.js    # 判定システム
│   │   └── NoteManager.js       # ノーツ管理
│   ├── charts/            # 譜面データ
│   │   ├── song1-easy.json
│   │   ├── song1-normal.json
│   │   ├── song1-hard.json
│   │   ├── song2-easy.json
│   │   └── song3-easy.json
│   ├── data/
│   │   └── songList.js    # 楽曲リスト
│   └── utils/
│       └── constants.js   # 定数定義
└── docs/                  # ドキュメント用画像など
    ├── screenshot.png
    └── gameplay.gif
```

## 🐛 トラブルシューティング

### VRMモデルが表示されない

- ファイルパスを確認: `/public/models/test-game.vrm`
- ブラウザのコンソールでエラーを確認
- VRMファイルが破損していないか確認

### 音楽が再生されない

- MP3ファイルが正しく配置されているか確認
- ブラウザの自動再生ポリシーを確認
- 対応フォーマット: MP3のみ

### ノーツが表示されない

- 譜面データのJSONが正しいか確認
- `duration` が適切に設定されているか確認
- ブラウザのコンソールでエラーを確認

### パフォーマンスが悪い

- ブラウザのハードウェアアクセラレーションを有効化
- VRMモデルのポリゴン数を削減
- 他のアプリケーションを閉じる

### npm install でエラーが出る

```bash
# キャッシュをクリア
npm cache clean --force

# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 🛠️ 技術スタック

- **React 18** - UIフレームワーク
- **Three.js** - 3Dレンダリング
- **@react-three/fiber** - React用Three.jsラッパー
- **@react-three/drei** - Three.jsヘルパー
- **@pixiv/three-vrm** - VRMモデルローダー
- **Vite** - 高速ビルドツール

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📧 お問い合わせ

問題や質問がある場合は、GitHubのIssueを作成してください。

## 🙏 クレジット

- VRMモデル: [VRoid Studio](https://vroid.com/studio)
- 音楽素材: 各自で用意してください
- Three.js: [Three.js](https://threejs.org/)
- VRM Specification: [VRM Consortium](https://vrm.dev/)

---

⭐ このプロジェクトが気に入ったら、GitHubでスターをお願いします！