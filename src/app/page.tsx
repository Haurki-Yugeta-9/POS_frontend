// Vercel用
'use client'  // クライアントコンポーネントとして動作させる

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'  // URLクエリパラメータ取得用
import { fetchProductByCode, postPurchase } from '@/lib/api'  // API関数
import ProductList from '@/components/ProductList'            // 商品一覧表示コンポーネント
import PurchasePopup from '@/components/PurchasePopup'        // 購入完了ポップアップ
import { Product } from '@/types'                             // 商品型定義

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])  // 現在のカート（商品一覧）
  const [popupData, setPopupData] = useState(null)         // 購入結果ポップアップのデータ
  const searchParams = useSearchParams()                   // URLクエリパラメータを取得する（?code=...）

  // 商品コードがURLにあれば自動で取得してカートに追加
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      fetchProductByCode(code).then((p) => {
        if (p) setProducts((prev) => [...prev, p])  // 商品が見つかればカートに追加
      })
    }
  }, [searchParams])  // クエリパラメータが変わるたびに実行

  // カートから商品を削除する処理
  const handleRemove = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index))
  }

  // 「購入する」ボタンが押されたときの処理
  const handlePurchase = async () => {
    const res = await postPurchase({
      EMP_CD: '9999999999',  // 仮の従業員コード
      STORE_CD: '30',        // 仮の店舗コード
      POS_NO: '90',          // 仮のPOS端末番号
      items: products,       // カート内の商品を送信
    })
    setPopupData(res)        // レスポンスをポップアップに渡す
    setProducts([])          // カートをクリア
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">商品購入画面</h1>
      
      {/* カメラによる商品スキャン画面へ遷移 */}
      <a href="/scan" className="text-blue-500 underline">カメラでスキャン</a>

      {/* 商品リストを表示（削除も可能） */}
      <ProductList items={products} onRemove={handleRemove} />

      {/* 購入ボタン：カートが空のときは非活性 */}
      <button
        onClick={handlePurchase}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
        disabled={products.length === 0}
      >
        購入する
      </button>

      {/* 購入完了後のポップアップ */}
      {popupData && (
        <PurchasePopup
          data={popupData}
          onClose={() => setPopupData(null)}  // 閉じるときにポップアップを消す
        />
      )}
    </div>
  )
}



// 'use client';

// import React, { useState } from 'react';
// import ScanButton from './components/ProductRegistration/ScanButton';
// import ProductInfoForm from './components/ProductRegistration/ProductInfoForm';
// import BarcodeScannerModal from './components/ProductRegistration/BarcodeScannerModal';
// import PurchaseList from './components/PurchaseList/PurchaseList';
// import CheckoutButton from './components/CheckoutSection/CheckoutButton';
// import CheckoutModal from './components/CheckoutSection/CheckoutModal';
// import useShoppingCart from './hooks/useShoppingCart';
// import { Product } from './types/product';

// // useShoppingCartからcheckoutの戻り値の型を推論するか、明示的に定義
// interface CheckoutResultType {
//   success: boolean;
//   data?: { // useShoppingCartのCheckoutSuccessDataと同じ構造
//     totalAmountWithTax: number;
//     totalAmountWithoutTax: number;
//     trdId: number;
//   };
//   error?: string;
// }

// export default function HomePage() {
//   const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
//   const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
//   const [scanError, setScanError] = useState<string | null>(null);

//   const { cart, addItemToCart, clearCart, checkout, isLoading: isCheckoutLoading } = useShoppingCart();

//   const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
//   const [checkoutResult, setCheckoutResult] = useState<CheckoutResultType | null>(null); // anyをCheckoutResultTypeに修正

//   const handleOpenScanner = () => {
//     setScannedProduct(null); // スキャナを開くときに前回の情報をクリア
//     setScanError(null);
//     setIsScannerModalOpen(true);
//   };

//   const handleCloseScanner = () => {
//     setIsScannerModalOpen(false);
//     // モーダル内でエラーが発生していた場合は、そのエラーをメインページに引き継ぐ
//     if (scanError === null && scannedProduct === null) {
//       // エラーもないし商品もない場合は、何もしない
//     }
//   };

//   const handleScanSuccess = (product: Product) => {
//     setScannedProduct(product);
//     setScanError(null);
//     setIsScannerModalOpen(false); // スキャン成功時もモーダルを閉じる
//     // ProductInfoFormに商品情報が表示される
//   };

//   const handleScanError = (message: string) => {
//     // モーダルが閉じられた時のみ、メインページにエラーを表示
//     if (!isScannerModalOpen) {
//       setScanError(message);
//     } else {
//       // モーダルが開いている場合は、モーダル内でエラーが表示されるので
//       // ここではエラーメッセージを設定しない
//       setScanError(null);
//     }
//     setScannedProduct(null);
//   };

//   const handleAddToCart = (product: Product) => {
//     addItemToCart(product);
//     setScannedProduct(null); // カート追加後、商品情報フォームをクリア
//   };

//   const handleCheckout = async () => {
//     const result = await checkout();
//     setCheckoutResult(result);
//     setIsCheckoutModalOpen(true);
//     // if (result.success) { // 成功時の処理はモーダル側で行うか検討
//     // }
//   };

//   const handleCloseCheckoutModal = () => {
//     setIsCheckoutModalOpen(false);
//     if (checkoutResult?.success) {
//         clearCart(); // 正常終了後、OKを押したらカートクリア
//     }
//     setCheckoutResult(null);
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-2xl bg-gray-100 min-h-screen">
//       <header className="mb-6">
//         <h1 className="text-3xl font-bold text-center text-blue-700">ポップアップストア</h1>
//       </header>

//       <main className="space-y-6">
//         {/* 商品登録セクション */}
//         <section className="p-5 bg-white rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">商品登録</h2>
//           <div className="space-y-4">
//             <ScanButton onClick={handleOpenScanner} disabled={isScannerModalOpen || isCheckoutLoading} />
//             {/* スキャナーモーダルが閉じられた後にのみエラーを表示 */}
//             {!isScannerModalOpen && scanError && (
//               <p className="text-red-500 text-sm text-center">エラー: {scanError}</p>
//             )}
//             <ProductInfoForm product={scannedProduct} onAddToCart={handleAddToCart} />
//           </div>
//         </section>

//         {/* 購入リストセクション */}
//         <section className="p-5 bg-white rounded-xl shadow-lg">
//           <PurchaseList cart={cart} />
//         </section>

//         {/* 購入処理セクション */}
//         <section className="mt-8">
//           <CheckoutButton 
//             onClick={handleCheckout} 
//             disabled={cart.items.length === 0 || isCheckoutLoading}
//             isLoading={isCheckoutLoading}
//           />
//         </section>
//       </main>

//       {/* モーダルコンポーネント */}
//       <BarcodeScannerModal
//         isOpen={isScannerModalOpen}
//         onClose={handleCloseScanner}
//         onScanSuccess={handleScanSuccess}
//         onScanError={handleScanError}
//       />
//       <CheckoutModal
//         isOpen={isCheckoutModalOpen}
//         onClose={handleCloseCheckoutModal}
//         checkoutData={
//           checkoutResult?.success && checkoutResult.data ?
//           { // 成功時
//             totalAmountWithTax: checkoutResult.data.totalAmountWithTax,
//             totalAmountWithoutTax: checkoutResult.data.totalAmountWithoutTax,
//           } :
//           checkoutResult?.error ?
//           { // APIエラー時
//             errorMessage: checkoutResult.error
//           } :
//           null // それ以外 (初期状態など)
//         }
//       />

//       <footer className="text-center mt-10 py-4 text-sm text-gray-500">
//         <p>&copy; {new Date().getFullYear()} テクワン株式会社</p>
//       </footer>
//     </div>
//   );
// }
