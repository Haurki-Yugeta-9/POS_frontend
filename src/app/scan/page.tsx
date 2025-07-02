'use client'  // クライアントコンポーネントとしてマーク

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'  // ZXing のバーコードリーダー
import { useRouter } from 'next/navigation'                // ルーター（ページ遷移用）

export class NotFoundException extends Error {
  constructor(message: "Not found") {
    super(message)
    this.name = 'NotFoundException'
  }
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null) // ビデオ要素への参照
  const router = useRouter()                      // ページ遷移用のルーター
  const [error, setError] = useState('')          // スキャン時のエラーメッセージ

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()  // バーコードリーダーのインスタンス

    codeReader.decodeFromConstraints(
      {
        video: { facingMode: 'environment' }  // 背面カメラを使用
      },
      videoRef.current!,                      // HTMLVideoElement に出力
      (result, err) => {
        if (result) {
          // スキャン成功時 → トップページに商品コード付きで遷移
          router.push(`/?code=${result.getText()}`)
        }
        if (err && !(err instanceof NotFoundException)) {
          // エラーのうち、NotFound（バーコード未検出）は無視し、それ以外を表示
          setError('スキャンエラーが発生しました')
        }
      }
    )

    // アンマウント時にリーダーをリセット（カメラ停止）
    return () => {
        ;(codeReader as any).reset?.()
    }
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">バーコードをスキャンしてください</h1>
      <video ref={videoRef} className="w-full border rounded" /> {/* カメラ映像 */}
      {error && <p className="text-red-500">{error}</p>}          {/* エラー表示 */}
    </div>
  )
}
