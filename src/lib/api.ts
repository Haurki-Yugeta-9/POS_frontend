import { Product } from '@/types'

// APIのベースURLを環境変数から取得（なければデフォルトのRender URLを使用）
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api.render.com'

// 商品コードを使って商品情報を取得する関数
export async function fetchProductByCode(code: string): Promise<Product | null> {
  // GETリクエストを送信
  const res = await fetch(`${API_BASE}/product?code=${code}`)

  // ステータスコードが200系でなければnullを返す（エラー処理）
  if (!res.ok) return null

  // レスポンスをJSONとしてパースして返す（Product型）
  return await res.json()
}

// 購入データを送信する関数（POST）
export async function postPurchase(data: any) {
  // POSTリクエストで購入データを送信
  const res = await fetch(`${API_BASE}/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // JSON形式で送信することを明示
    body: JSON.stringify(data),                      // JavaScriptオブジェクトをJSON文字列に変換
  })

  // レスポンスをJSONとして返す（FastAPIのPurchaseResult形式が返る想定）
  return await res.json()
}
