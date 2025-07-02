# LoL Insight Pro

**League of Legends プレイデータ分析ツール**

LoL Insight Proは、League of Legendsのプレイデータを詳細分析し、プロ平均との比較・選択肢の振り返り・次回プレイへのインサイトを提供する高機能分析Webアプリケーションです。

![LoL Insight Pro](https://img.shields.io/badge/LoL-Insight%20Pro-blue?style=flat-square&logo=league-of-legends)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ 主要機能

### 📊 Basic Metrics
- KDA、CS/min、Gold/min、Damage/minの詳細分析
- 試合履歴からの平均値計算とトレンド表示
- パフォーマンス評価（Excellent/Good/Needs Improvement）

### 👥 Account Overview
- 複数アカウントの成績比較
- Win Rate/Role別の比較グラフ
- 成長率バッジ表示

### 👁️ Vision Lab
- ワード配置と死角の可視化
- Vision Efficiency Score算出
- マップ上での視界管理分析

### 🎯 Objective Hub
- ドラゴン・バロン取得タイミングのプロ比較
- 時系列タイムラインチャート
- Zone Controlヒートマップ

### 💰 Gold Trade Simulator
- リコール判断の機会損失計算
- "リコール→装備購入" vs "継続レーン"のGPM比較
- シミュレーション結果の視覚化

### 🤖 AI Insights
- Gemini APIによる改善コメント生成
- PDFレポート自動生成
- 個別化された上達アドバイス

## 🛠️ 技術スタック

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres + Prisma ORM
- **Charts**: Recharts + D3.js
- **API**: Riot Games API
- **AI**: Google Gemini API
- **Deploy**: Vercel

## 🚀 セットアップ

### 必要条件

- Node.js 18.0.0 以上
- npm または yarn
- Riot Games API Key
- Google Gemini API Key（AI機能用）

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/Ben-1327/lol-insight-pro.git
cd lol-insight-pro
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env.local
```

`.env.local`ファイルに以下を設定：
```env
RIOT_API_KEY=your_riot_api_key_here
POSTGRES_PRISMA_URL=your_postgres_url_here
GEMINI_API_KEY=your_gemini_api_key_here
```

4. データベースをセットアップ
```bash
npx prisma generate
npx prisma db push
```

5. 開発サーバーを起動
```bash
npm run dev
```

アプリケーションは http://localhost:3000 でアクセスできます。

## 📖 使用方法

1. **サモナー検索**: ダッシュボードでサモナー名とリージョンを入力
2. **データ分析**: 自動的に試合履歴を取得・分析
3. **結果確認**: Basic Metricsやその他の分析結果を確認
4. **改善**: AIレポートで個別の改善提案を受け取り

## 🎯 対象ユーザー

- 中級〜上級者LoLプレイヤー
- データドリブンで上達したいプレイヤー
- プロ選手との比較分析に興味があるプレイヤー

## 📈 開発ロードマップ

- [x] Basic Metrics実装
- [ ] Account Overview実装
- [ ] Vision Lab実装
- [ ] Objective Hub実装
- [ ] Gold Trade Simulator実装
- [ ] AI Insights実装
- [ ] Vercelデプロイ

## 🤝 コントリビューション

コントリビューションを歓迎します！以下の手順でお願いします：

1. Forkする
2. Feature branchを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. Branchにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🔗 関連リンク

- [Riot Games API Documentation](https://developer.riotgames.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 📞 サポート

質問やサポートが必要な場合は、[Issue](https://github.com/Ben-1327/lol-insight-pro/issues)を作成してください。

---

**LoL Insight Pro** - League of Legendsプレイヤーの上達を支援する次世代分析ツール
