# コントリビューションガイド

このプロジェクトへの貢献を歓迎します！

## 開発環境のセットアップ

1. リポジトリをフォーク
2. クローン
```bash
   git clone https://github.com/YOUR_USERNAME/Game-work.git
   cd Game-work
```
3. 依存関係をインストール
```bash
   npm install
```
4. VRMモデルと音楽ファイルを配置（README.md参照）
5. 開発サーバー起動
```bash
   npm run dev
```

## ブランチ戦略

- `main` - 安定版
- `develop` - 開発版
- `feature/*` - 新機能
- `bugfix/*` - バグ修正

## プルリクエストの手順

1. 新しいブランチを作成
```bash
   git checkout -b feature/your-feature-name
```
2. 変更を実装
3. コミット
```bash
   git add .
   git commit -m "Add: 機能の説明"
```
4. プッシュ
```bash
   git push origin feature/your-feature-name
```
5. GitHubでプルリクエストを作成

## コミットメッセージの規則

- `Add:` - 新機能追加
- `Fix:` - バグ修正
- `Update:` - 既存機能の更新
- `Refactor:` - リファクタリング
- `Docs:` - ドキュメント更新
- `Style:` - コードスタイルの変更

## コーディング規約

- ESLintの設定に従う
- コンポーネントは関数コンポーネントで記述
- ファイル名はPascalCase（コンポーネント）またはcamelCase

## 問題の報告

バグや機能要望は[Issues](../../issues)で報告してください。

## ライセンス

コントリビューションは MIT License の下で公開されます。
