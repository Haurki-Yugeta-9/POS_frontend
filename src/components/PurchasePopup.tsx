// Propsの型定義：購入合計金額とポップアップを閉じる関数を受け取る
type Props = {
  data: {
    total: number         // 合計（税込）
    total_ex_tax: number  // 合計（税抜）
  }
  onClose: () => void     // 閉じる処理（ボタン押下時に呼び出す）
}

// ポップアップコンポーネント本体
export default function PurchasePopup({ data, onClose }: Props) {
  return (
    // フルスクリーンの半透明黒背景（ポップアップを中央に表示）
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      {/* 白背景のモーダルボックス */}
      <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
        <h2 className="text-xl font-bold mb-4">購入完了</h2>

        {/* 合計金額（税込・税抜）を表示 */}
        <p>合計（税込）: ￥{data.total.toLocaleString()}</p>
        <p>合計（税抜）: ￥{data.total_ex_tax.toLocaleString()}</p>

        {/* OKボタンでポップアップを閉じる */}
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  )
}
