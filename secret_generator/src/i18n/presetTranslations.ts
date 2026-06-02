import type { SecretCategory } from '../core/types';
import type { SecretCategoryDefinition, SecretPreset } from '../presets/types';
import type { Locale } from './types';

type LocalizedText = {
  label: string;
  description: string;
  aliases?: string[];
  warnings?: string[];
};

const categoryJa = {
  password: {
    label: 'パスワード',
    description: 'サインイン、DB、manager 保存向けの意味を持たないランダムパスワード。',
  },
  'numeric-code': {
    label: '数字コード',
    description: '一時用途向けの PIN と短い数字コード。',
  },
  token: {
    label: 'トークン',
    description: 'API key、Webhook secret、Session secret、CSRF secret。',
  },
  'jwt-secret': {
    label: 'JWT Secret',
    description: 'HS256、HS384、HS512 JWT 署名向けの HMAC 共有 secret。',
  },
  'encryption-key': {
    label: '暗号化キー',
    description: 'AES-GCM や HMAC 用途の raw shared key。',
  },
  random: {
    label: 'ランダム',
    description: 'Hex、Base64、Base64url、ランダムバイト、UUID v4。',
  },
  env: {
    label: '.env',
    description: '環境ファイル向けの KEY=value アプリケーション secret。',
  },
} satisfies Record<SecretCategory, { label: string; description: string }>;

const presetsJa: Record<string, LocalizedText> = {
  'random-password': {
    label: 'ランダムパスワード',
    description: '選択した文字集合から生成する高エントロピーなランダムパスワード。',
    aliases: ['パスワード', 'カスタムパスワード', 'ランダム文字列'],
    warnings: [
      'このパスワードは覚えることを目的としていません。パスワードマネージャーや secret manager に保存してください。',
      '記号を使う場合は、利用先システムのパスワードルールを確認してください。',
    ],
  },
  'sign-in-password': {
    label: 'サインイン用パスワード',
    description: 'Web サービスや管理画面のログイン用パスワード。',
    aliases: ['ログイン', 'アカウント', '管理画面パスワード', 'サービスパスワード'],
    warnings: [
      '利用先サービスには独自の最大文字数や記号ルールがある場合があります。',
      'このツールはサービス固有の互換性を保証しません。',
    ],
  },
  'database-password': {
    label: 'DB パスワード',
    description: 'DSN に貼りやすい safe symbols をデフォルトにした DB ユーザー用パスワード。',
    aliases: ['db', 'データベース', 'postgres', 'mysql', 'redis', 'mongodb', 'dsn'],
    warnings: [
      'DSN に直接埋め込む場合は URL encode が必要になることがあります。',
      'safe symbols は互換性を上げますが、同じ長さでは文字集合が小さくなります。',
    ],
  },
  pin: {
    label: 'PIN',
    description: '短期・一時用途向けの数字コード。',
    aliases: ['数字コード', '桁', 'デバイスコード'],
    warnings: [
      'PIN は長期的なシークレットには向きません。',
      'より強い保護が必要な場合は token または password preset を使ってください。',
    ],
  },
  'api-token': {
    label: 'API トークン',
    description: '任意の prefix を付けられる URL-safe な API key 風トークン。',
    aliases: ['api key', 'bearer token', 'access token', 'アクセストークン'],
    warnings: ['prefix は token 種別の識別に役立ちますが、エントロピーには寄与しません。'],
  },
  'webhook-secret': {
    label: 'Webhook secret',
    description: 'Webhook 署名検証用の共有 secret。',
    aliases: ['webhook', '署名', 'hmac webhook'],
    warnings: ['Webhook secret を公開リポジトリやログに出力しないでください。'],
  },
  'session-secret': {
    label: 'Session secret',
    description: 'Cookie session やサーバー側 session の署名に使う secret。',
    aliases: ['cookie secret', 'session signing', 'app secret', 'セッション'],
    warnings: [
      'session secret を変更すると既存セッションが無効になる場合があります。',
      '複数の app instance で同じ値を共有する必要がある場合があります。',
    ],
  },
  'csrf-secret': {
    label: 'CSRF secret',
    description: 'CSRF token の生成または署名に使う secret。',
    aliases: ['csrf', 'anti csrf', 'xsrf'],
    warnings: ['CSRF token そのものと、token 署名用 secret は異なる場合があります。'],
  },
  'jwt-hs256': {
    label: 'JWT HS256 secret',
    description: 'JWT HS256 署名用の HMAC 共有 secret。',
    aliases: ['jwt', 'hs256', 'hmac', 'json web token'],
    warnings: ['HS 系アルゴリズムは共有 secret を使います。公開鍵/秘密鍵ペアではありません。'],
  },
  'jwt-hs384': {
    label: 'JWT HS384 secret',
    description: 'JWT HS384 署名用の HMAC 共有 secret。',
    aliases: ['jwt', 'hs384', 'hmac', 'json web token'],
    warnings: ['HS384 の想定強度より短い値は使わない設計にしてください。'],
  },
  'jwt-hs512': {
    label: 'JWT HS512 secret',
    description: 'JWT HS512 署名用の HMAC 共有 secret。',
    aliases: ['jwt', 'hs512', 'hmac', 'json web token'],
    warnings: ['これは共有 secret です。公開してはいけません。'],
  },
  'aes-gcm-key': {
    label: 'AES-GCM key',
    description: 'AES-GCM 暗号化用途の raw symmetric key。',
    aliases: ['aes', 'gcm', '暗号化キー', '共通鍵'],
    warnings: [
      'AES-GCM key は nonce や IV とは別物です。',
      '同じ AES-GCM key と nonce の組み合わせを再利用してはいけません。',
    ],
  },
  'hmac-sha256-key': {
    label: 'HMAC-SHA-256 key',
    description: 'HMAC-SHA-256 の署名や改ざん検知に使う shared key。',
    aliases: ['hmac', 'sha256', 'mac', 'signing key', '署名キー'],
    warnings: ['HMAC key は共有 secret です。client code に露出させないでください。'],
  },
  'hmac-sha384-key': {
    label: 'HMAC-SHA-384 key',
    description: 'HMAC-SHA-384 の署名や改ざん検知に使う shared key。',
    aliases: ['hmac', 'sha384', 'mac', 'signing key', '署名キー'],
    warnings: ['HMAC key は共有 secret です。ログやリポジトリに残さないでください。'],
  },
  'hmac-sha512-key': {
    label: 'HMAC-SHA-512 key',
    description: 'HMAC-SHA-512 の署名や改ざん検知に使う shared key。',
    aliases: ['hmac', 'sha512', 'mac', 'signing key', '署名キー'],
    warnings: ['HMAC key は共有 secret です。ログやリポジトリに残さないでください。'],
  },
  'hex-token': {
    label: 'Hex token',
    description: 'lowercase hexadecimal で表示するランダムトークン。',
    aliases: ['hex', 'ランダム hex', 'token', 'トークン'],
  },
  'base64-token': {
    label: 'Base64 token',
    description: 'standard Base64 で表示するランダムトークン。',
    aliases: ['base64', 'ランダム base64', 'token', 'トークン'],
    warnings: ['standard Base64 には +、/、= が含まれる場合があります。'],
  },
  'base64url-token': {
    label: 'Base64url token',
    description: 'padding なしの URL-safe Base64 で表示するランダムトークン。',
    aliases: ['base64url', 'url safe token', 'cookie token', 'トークン'],
  },
  'random-bytes': {
    label: 'ランダムバイト',
    description: 'エンコードして表示するランダムバイト列。',
    aliases: ['bytes', 'binary', 'random data', 'バイト列'],
    warnings: ['raw bytes は表示とコピーのためにエンコードされます。'],
  },
  'uuid-v4': {
    label: 'UUID v4',
    description: 'ランダムな UUID v4 identifier。',
    aliases: ['uuid', 'guid', 'random id', 'identifier', '識別子'],
    warnings: ['UUID v4 は主に識別子用途です。強い secret には 256-bit token を使ってください。'],
  },
  'env-secret': {
    label: '.env secret',
    description: '環境ファイル向けの KEY=value secret。',
    aliases: ['env', 'dotenv', 'app secret', 'nextauth', 'session secret', '環境変数'],
    warnings: [
      '.env ファイルを公開リポジトリに commit しないでください。',
      '必要に応じて、利用する framework 固有の形式や長さを確認してください。',
    ],
  },
} satisfies Record<string, LocalizedText>;

export function getCategoryText(
  category: SecretCategoryDefinition,
  locale: Locale,
): { label: string; description: string } {
  if (locale === 'ja') {
    return categoryJa[category.id];
  }

  return {
    label: category.label,
    description: category.description,
  };
}

export function getPresetText(preset: SecretPreset, locale: Locale): LocalizedText {
  if (locale === 'ja') {
    return {
      label: presetsJa[preset.id]?.label ?? preset.label,
      description: presetsJa[preset.id]?.description ?? preset.description,
      aliases: presetsJa[preset.id]?.aliases ?? preset.aliases,
      warnings: presetsJa[preset.id]?.warnings ?? preset.warnings,
    };
  }

  return {
    label: preset.label,
    description: preset.description,
    aliases: preset.aliases,
    warnings: preset.warnings,
  };
}

export function getSearchText(preset: SecretPreset, locale: Locale): string {
  const localized = getPresetText(preset, locale);
  const ja = presetsJa[preset.id];

  return [
    preset.id,
    preset.label,
    preset.description,
    preset.category,
    ...preset.aliases,
    localized.label,
    localized.description,
    ...(localized.aliases ?? []),
    ...(ja?.aliases ?? []),
  ]
    .join(' ')
    .toLowerCase();
}
