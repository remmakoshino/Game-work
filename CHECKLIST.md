# ✅ GitHub公開前チェックリスト

このチェックリストを使用して、リポジトリ公開前の準備を確認してください。

## 📝 ファイルの確認

- [ ] README.md が完成している
- [ ] LICENSE ファイルが存在する
- [ ] .gitignore が適切に設定されている
- [ ] package.json のメタデータが更新されている
- [ ] CONTRIBUTING.md が用意されている

## 🔒 機密情報のチェック

- [ ] APIキーやパスワードが含まれていない
- [ ] 個人情報が含まれていない
- [ ] VRMモデルが .gitignore に含まれている
- [ ] 音楽ファイルが .gitignore に含まれている

## 🧪 動作確認

- [ ] `npm install` が正常に動作する
- [ ] `npm run dev` でゲームが起動する
- [ ] VRMモデルを配置して表示される
- [ ] 音楽ファイルを配置して再生される
- [ ] ゲームプレイが正常に動作する
- [ ] ビルド (`npm run build`) が成功する

## 📦 リポジトリ設定

- [ ] リポジトリ名が適切
- [ ] リポジトリの説明が記載されている
- [ ] トピック/タグが設定されている
- [ ] 公開設定が正しい（Public/Private）

## 📸 ビジュアル要素

- [ ] スクリーンショットを撮影
- [ ] `docs/screenshot.png` として保存
- [ ] README.md で画像を参照
- [ ] （オプション）GIFアニメーションを作成

## 🔗 リンクの更新

package.json と README.md 内の以下を更新：
- [ ] `YOUR_USERNAME` を実際のGitHubユーザー名に変更
- [ ] `[Your Name]` を実際の名前に変更
- [ ] リポジトリURLを正しく設定

## 🚀 公開手順

1. ローカルで最終確認
```bash
   git status
   git add .
   git commit -m "Initial commit"
```

2. GitHubでリポジトリ作成
   - https://github.com/new
   - リポジトリ名: `Game-work` (または任意)
   - Public または Private を選択
   - README, .gitignore, license は**追加しない**（既にある）

3. リモートリポジトリを追加
```bash
   git remote add origin https://github.com/YOUR_USERNAME/Game-work.git
   git branch -M main
   git push -u origin main
```

4. GitHub Pagesの設定（オプション）
   - Settings → Pages
   - Source: GitHub Actions
   - `.github/workflows/deploy.yml` が自動デプロイ

## 📢 公開後

- [ ] リポジトリのAboutセクションを更新
- [ ] トピックを追加（例: `rhythm-game`, `vrm`, `three-js`, `react`）
- [ ] README.mdのスクリーンショットを確認
- [ ] 他の人が clone → setup できるかテスト

## 🎉 完了！

すべてチェックしたら、リポジトリを公開して世界に共有しましょう！
