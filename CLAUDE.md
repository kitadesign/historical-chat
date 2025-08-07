# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

歴史上の人物（レオナルド・ダ・ヴィンチ、マリー・キュリー、アインシュタイン、エジソン）と対話できるWebアプリケーション。Claude APIを使用してキャラクターになりきったAIレスポンスを生成する。

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（nodemon使用、自動リロード有効）
npm run dev

# 本番サーバー起動
npm start
```

## アーキテクチャ

### バックエンド構成
- **server.js**: Express.jsサーバー
  - `/api/chat`: メインの対話エンドポイント（セッション管理機能付き）
  - `/api/reset-session`: セッションリセット
  - `/api/health`: ヘルスチェック
- **Claude API**: claude-sonnet-4-20250514モデルを使用
- **セッション管理**: メモリ内Mapで会話履歴を保持（最大20メッセージ）

### フロントエンド構成
- **public/index.html**: 全てのUI要素とロジックを含む単一ファイル
  - インラインCSS/JSで完結
  - セッションIDをlocalStorageで管理
  - キャラクター選択とチャットUIを統合

### 重要な実装詳細

1. **キャラクタープロンプト**: server.js内の`characterPrompts`オブジェクトで各人物の性格・口調を定義
2. **レスポンス制限**: 各キャラクターは200文字以内の簡潔な回答を返すよう設定
3. **エラーハンドリング**: Claude APIエラー時は詳細なエラーメッセージを返す
4. **環境変数**: `.env`ファイルで`CLAUDE_API_KEY`を設定（必須）

## 開発上の注意点

- テストは実装されていない
- TypeScriptは使用していない（純粋なJavaScript）
- ビルドプロセスなし（静的ファイルを直接配信）
- public/script.jsとstyle.cssは現在未使用（index.htmlにインライン化済み）