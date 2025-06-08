import{useState} from 'react';

type Product = {
    PRD_ID: number;
    CODE: string;
    NAME: string;
    PRICE: number;
};


type CartItem = Product & {quantity: number};

export default function POSPage(){
    const [code, setCode]= useState('');
    const [product, setProduct]= useState<Product | null>(null);
    const [message, setMessage]= useState('');
    const [cart, setCart]= useState<CartItem[]>([]);
    const [total, setTotal]= useState<number | null>(null);

    const handleRead = async()=>{
        const res = await fetch(`http://localhost:8000/product?code=${code}`);
        const data = await res.json();
        if(data){
            setProduct(data);
            setMessage('');
        }else{
            setProduct(null);
            setMessage('商品マスタが未登録です');
        }
    };


    const handleAdd = () => {
        if(!product) return;
        const exists = cart.find((item)=> item.PRD_ID === product.PRD_ID);
        if(exists) {
            setCart(cart.map((item)=>
            item.PRD_ID === product.PRD_ID ? { ...item, quantity: item.quantity +1} :item));
        }else{
            setCart([...cart, {...product, quantity: 1}]);
        }
        setProduct(null);
        setCode('');
        setMessage('');
    };

    const handlePurchase = async ()=> {
        const empCd = '9999999999';
        const items = cart.map((item)=> ({
            PRD_ID: item.PRD_ID,
            CODE: item.CODE,
            NAME: item.NAME,
            PRICE: item.PRICE,
        }));
        const res = await fetch(`http://localhost:8000/purchase`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({emp_cd: empCd, items: cart})
        });
        const data = await res.json();
        if (data.success){
            setTotal(data.total);
            setCart([]);
            setCode('');
            setProduct(null);
            setMessage('');
        }
    };

    return (
        <div className='flex flex-col md:flex-row max-w-4xl mx-auto mt-6 p-4 gap-8'>
            {/*左側：入力・登録*/}
            <div className='flex-1 space-y-3'>
                {/*コード入力エリア*/}
                <input 
                    type='text'
                    placeholder='商品コードを入力'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className='border p-2 w-full'
                />

                {/*読み込みボタン*/}
                <button
                    onClick={handleRead}
                    className='bg-blue-200 text-black font-bold w-full py-2 border'
                >
                    商品コード 読み込み
                </button>

                {/* 名称表示エリア */}
                <div className='border p-2 bg-white'>
                    {message ? message : product?.NAME || ''}
                </div>

                {/* 単価表示エリア */}
                <div className='border p-2 bg-white'>
                    {product ? `${product.PRICE}円`: ''}
                </div>

                {/* 追加ボタン */}
                <button
                    onClick={handleAdd}
                    className='bg-blue-200 text-black font-bold w-full py-2 border'
                >
                    追加
                </button>
            </div>

            {/* 右側：購入リストと購入 */}
            <div className='flex-1 border p-4'>
                <h2 className='text-center font-bold mb-2'>
                    購入リスト
                </h2>
                <div className='space-y-1'>
                    {cart.map((item, i) => (
                        <div key={i} className='flex justify-between border-b text-sm'>
                            <span>{item.NAME} ×{item.quantity}</span>
                            <span>{item.PRICE}円</span>
                            <span>{item.PRICE * item.quantity}円</span>
                        </div>
                    ))}
                </div>

                {/* 購入ボタン */}
                {cart.length > 0&&(
                    <button
                        onClick={handlePurchase}
                        className='bg-blue-200 text-black font-bold w-full py-2 mt-4 border'
                    >
                        購入
                    </button>
                )}     
            </div>

            {/* 合計金額のポップアップ */}
            {total !== null &&(
                <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center'>
                    <div className='bg-white p-6 rounded shadow-lg text-center'>
                        <p className='text-xl font-bold'>合計金額（税込）</p>
                        <p className='text-3xl my-4'>¥{total}</p>
                        <button
                            onClick={() => setTotal(null)}
                            className='bg-blue-500 text-white px-6 py-2 rounded'
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}