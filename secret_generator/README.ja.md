# シークレット生成

ブラウザ内だけでシークレットを生成する静的 SPA です。

## MVP 範囲

実装済み:

- ランダム、サインイン用、DB 用パスワード
- PIN / 数字コード
- API token、Webhook secret、Session secret、CSRF secret
- JWT HS256 / HS384 / HS512 shared secret
- AES-GCM / HMAC key
- Hex、Base64、Base64url、ランダムバイト、UUID v4
- `.env` `KEY=value` secret

MVP に含めないもの:

- Passphrase、Diceware、word-based secret
- JWK / JWKS
- RSA、ECDSA、Ed25519、SSH key、CSR、証明書
- アカウント、生成履歴、生成した secret の保存
- Analytics、telemetry、remote config、外部 error reporting、PWA

## セキュリティ方針

- 静的 SPA のみ
- バックエンド生成なし
- AI 生成なし
- Analytics / error reporting SDK なし
- 生成したシークレットの保存なし
- 生成値はコピーまたはクリアするまで React state / メモリと表示中の DOM にのみ保持
- 乱数生成には Web Crypto API の `crypto.getRandomValues()` を使用
- シークレット生成に `Math.random()` は使用しない
- 文字選択では rejection sampling により modulo bias を回避
- Cloudflare Pages 用 `_headers` で `connect-src 'none'` を設定
- UI は英語 / 日本語を切り替え可能。選択中の言語は React state のみに保持し、永続化しません

## ローカル確認

```sh
pnpm install
pnpm run test
pnpm run build
pnpm run test:e2e
```

手動確認:

```sh
pnpm run dev
```

DevTools の Network タブで Preserve log を有効にし、アプリ読み込み後にシークレットを生成してください。新しい通信が発生しないこと、browser storage に生成値が保存されないことを確認できます。

## 配布 ZIP の作成

配布先に渡す ZIP には、アプリが動作する最低限の生成物として `dist/` の中身だけを含めます。`src/`、`node_modules/`、テスト、ドキュメント、スクリーンショット、`package.json`、`pnpm-lock.yaml` は実行には不要です。

```sh
pnpm install --frozen-lockfile
pnpm run build

cd dist
zip -r -X ../secret-generator-dist.zip . -x "*.DS_Store" "__MACOSX/*"
```

ZIP の中身は次のようになります。

```text
index.html
_headers
assets/index-*.css
assets/index-*.js
```

`_headers` は Cloudflare Pages など対応している配布先でセキュリティヘッダーとして利用されます。対応していない静的サーバーでは通常のファイルとして置かれるだけなので、配布先の仕様に合わせて扱ってください。

このアプリは SPA のため、`/generator/random-password` のような直接アクセスや再読み込みに対応するには、配布先で存在しないパスを `index.html` に返す fallback 設定が必要です。
