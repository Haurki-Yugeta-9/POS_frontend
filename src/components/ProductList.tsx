import { Product } from '@/types'  // 商品情報の型をインポート

// コンポーネントのProps型：商品リストと、任意の削除ハンドラ
type Props = {
  items: Product[]                     // 表示する商品リスト
  onRemove?: (index: number) => void   // 任意：指定indexのアイテムを削除する関数
}

// 商品リスト表示コンポーネント
export default function ProductList({ items, onRemove }: Props) {
  return (
    <div className="mt-4">
      {items.map((item, index) => (
        <div
          key={index}  // 商品のindexをキーに（※理想は一意なIDを使う）
          className="border rounded p-2 mb-2 flex justify-between"
        >
          <div>
            {/* 商品名と価格を表示（価格はカンマ区切りで整形） */}
            <p>{item.NAME}</p>
            <p>￥{item.PRICE.toLocaleString()}</p>
          </div>

          {/* 削除ボタン（削除関数が渡されている場合のみ表示） */}
          {onRemove && (
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => onRemove(index)}  // indexを指定して削除
            >
              削除
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
