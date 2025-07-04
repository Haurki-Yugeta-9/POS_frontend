// // Vercel用に作り替えるため一旦作り直し

// import axios from 'axios';

// // 環境判定
// const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('azurewebsites.net');

// // ローカル用のAPIエンドポイントを設定
// const LOCAL_API_BASE = 'http://localhost:3000/api';

// // APIのベースURLを取得し、末尾のスラッシュを正規化する関数
// const getBaseUrl = () => {
//   // 本番環境（Azure）では正しいバックエンドURLを直接指定
//   if (isProduction) {
//     // フロントエンドは app-step4-61.azurewebsites.net、バックエンドは app-step4-62.azurewebsites.net
//     return 'https://app-step4-62.azurewebsites.net/api';
//   }
  
//   // // 開発環境では環境変数を使用
//   // let baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || '/api';
  
//   // // 末尾の余分な文字（%など）を削除
//   // baseUrl = baseUrl.replace(/%$/, '');
  
//   // // 末尾のスラッシュを正規化（あれば削除）
//   // return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

//   // ローカル用
//   return LOCAL_API_BASE;
// };

// const apiClient = axios.create({
//   baseURL: getBaseUrl(),
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   // CORSを有効にする
//   withCredentials: false
// });

// // パスの正規化を行う関数
// const normalizePath = (path: string) => {
//   // パスが既に/で始まっている場合はそのまま返す
//   if (path.startsWith('/')) {
//     return path;
//   }
//   // そうでなければ/を追加する
//   return `/${path}`;
// };

// // セキュアなログ出力関数
// const secureLog = (message: string) => {
//   // 本番環境ではログを出力しない
//   if (!isProduction) {
//     console.log(message);
//   }
// };

// // リクエスト前の共通処理
// apiClient.interceptors.request.use(config => {
//   // URLパスの正規化
//   if (config.url) {
//     config.url = normalizePath(config.url);
//   }
  
//   // 開発環境でのみデバッグログを出力
//   secureLog(`[API] Request to: ${config.baseURL}${config.url}`);
//   return config;
// });

// export default apiClient;
