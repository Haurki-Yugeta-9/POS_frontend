// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import useProductScanner from '../../hooks/useProductScanner';
// import { Product } from '../../types/product';
// import Modal from '../common/Modal'; // 共通モーダルコンポーネント
// import { Scanner, IDetectedBarcode as DetectedBarcode } from '@yudiel/react-qr-scanner'; // react-qr-scannerをインポート

// interface BarcodeScannerModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onScanSuccess: (product: Product) => void;
//   onScanError: (message: string) => void;
// }

// const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
//   isOpen,
//   onClose,
//   onScanSuccess,
//   onScanError,
// }) => {
//   // エラーメッセージを一元管理するため、一つのステートに統合
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isScannerPaused, setIsScannerPaused] = useState(false);
//   const [facingMode, setFacingMode] = useState<'environment' | 'user'>('user');
//   const scannerContainerRef = useRef<HTMLDivElement>(null);

//   const {
//     isLoading: isFetchingProduct,
//     error: fetchProductError,
//     fetchProductByJanCode,
//     resetError: resetFetchProductError,
//   } = useProductScanner(
//     (product) => {
//       onScanSuccess(product);
//       setIsScannerPaused(false);
//       onClose();
//     },
//     (errMsg) => {
//       // エラーメッセージを設定し、親コンポーネントにも通知（二重表示はしない）
//       setErrorMessage(errMsg);
//       onScanError(errMsg);
//       setIsScannerPaused(false);
//     }
//   );

//   const handleScan = useCallback(async (detectedCodes: DetectedBarcode[]) => {
//     if (isFetchingProduct || isScannerPaused) return;

//     // 中央付近のバーコードを検出
//     // 注：現在は位置の制限を無効化していますが、
//     // UIのガイド枠によってユーザーは自然と中央にバーコードを合わせるようになります
    
//     // 中央付近にあるバーコードを検出
//     for (const code of detectedCodes) {
//       if (code.rawValue) {
//         // すべてのバーコードを処理する（位置の制限を一時的に無効化）
//         const janCode = code.rawValue.trim();
//         console.log(`[Modal] Scanned code: ${janCode}`);
//         setErrorMessage(null);
//         resetFetchProductError();
//         setIsScannerPaused(true);
//         await fetchProductByJanCode(janCode);
//         return;
//       }
//     }
//   }, [isFetchingProduct, isScannerPaused, fetchProductByJanCode, resetFetchProductError]);

//   const handleScannerError = useCallback((error: unknown) => {
//     console.error("[Modal] Scanner error:", error);
//     let message = "スキャンエラーが発生しました。";
//     if (error instanceof Error) {
//       // カメラ許可がない場合のエラー名は NotAllowedError など
//       if (error.name === "NotAllowedError") {
//         message = "カメラの利用が許可されていません。ブラウザのアドレスバー横のカメラアイコンから許可してください。";
//       } else if (error.name === "NotFoundError") {
//         message = "カメラデバイスが見つかりません。";
//       } else {
//         message = error.message;
//       }
//     } else if (typeof error === 'string') {
//       message = error;
//     }
//     // エラーメッセージを設定
//     setErrorMessage(message);
//     onScanError(message);
//     setIsScannerPaused(false);
//   }, [onScanError]);

//   useEffect(() => {
//     if (isOpen) {
//       setErrorMessage(null);
//       resetFetchProductError();
//       setIsScannerPaused(false);
//     } else {
//       setIsScannerPaused(true);
//     }
//   }, [isOpen, resetFetchProductError]);

//   // fetchProductErrorが変更されたらerrorMessageも更新
//   useEffect(() => {
//     if (fetchProductError) {
//       setErrorMessage(fetchProductError);
//     }
//   }, [fetchProductError]);

//   const handleCloseModal = () => {
//     setIsScannerPaused(true);
//     onClose();
//   };

//   // カメラ切り替えボタン
//   const handleToggleCamera = () => {
//     setFacingMode((prev) => (prev === "environment" ? "user" : "user"));
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={handleCloseModal} title="バーコードスキャナー">
//       <div className="relative w-full max-w-md p-4 mx-auto bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
//         <button
//           onClick={handleToggleCamera}
//           className="mb-2 px-2 py-1 text-xs bg-gray-200 rounded"
//         >
//           カメラ切替（{facingMode === "user" ? "外側" : "内側"}）
//         </button>
               
//         <div className="w-full aspect-square max-w-xs mb-4" ref={scannerContainerRef}>
//           {isOpen && (
//             <div className="relative w-full h-full">
//               <Scanner
//                 onScan={handleScan}
//                 onError={handleScannerError}
//                 paused={isScannerPaused || isFetchingProduct}
//                 formats={[
//                   "ean_13", "ean_8", "upc_a", "upc_e",
//                   "qr_code",
//                 ]}
//                 styles={{
//                   container: { width: '100%', height: '100%', position: 'relative' },
//                   video: { width: '100%', height: '100%', objectFit: 'cover' }
//                 }}
//                 components={{
//                   finder: true,
//                 }}
//                 constraints={{
//                   width: { ideal: 640 },
//                   height: { ideal: 480 },
//                   facingMode: facingMode,
//                   aspectRatio: { ideal: 1 },
//                   frameRate: { max: 15 }
//                 }}
//                 scanDelay={500}
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none">
//                 <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-20 border-2 border-green-500 bg-transparent">
//                   <div className="absolute left-0 top-1/2 w-full h-0.5 bg-green-500 opacity-70 transform -translate-y-1/2"></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {isFetchingProduct && <p className="mt-2 text-sm text-blue-600">商品情報を検索中...</p>}
        
//         {/* エラーメッセージを統合して表示 */}
//         {errorMessage && <p className="mt-2 text-sm text-red-500">エラー: {errorMessage}</p>}
        
//         {!isFetchingProduct && !errorMessage && isOpen && !isScannerPaused && (
//            <p className="mt-2 text-sm text-gray-600">カメラでバーコードをスキャンしてください...</p>
//         )}

//         <button
//           onClick={handleCloseModal}
//           className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//         >
//           閉じる
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default BarcodeScannerModal;
