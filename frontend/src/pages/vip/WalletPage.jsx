import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { ChevronLeft, Wallet, CreditCard, Gift, History, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const WalletPage = () => {
  const { user } = useAuthStore();
  const [balance, setBalance] = useState(user?.balance || 0);

  const packages = [
    { id: 1, coins: 100, price: 10, bonus: 0 },
    { id: 2, coins: 500, price: 50, bonus: 50 },
    { id: 3, coins: 1000, price: 100, bonus: 150 },
    { id: 4, coins: 2000, price: 200, bonus: 400 },
    { id: 5, coins: 5000, price: 500, bonus: 1200 },
  ];

  const transactions = [
    { id: 1, type: 'earn', amount: 100, desc: '每日签到奖励', time: '2小时前' },
    { id: 2, type: 'spend', amount: -20, desc: '发送礼物', time: '昨天' },
    { id: 3, type: 'earn', amount: 50, desc: '完成任务奖励', time: '3天前' },
  ];

  const handlePurchase = (pkg) => {
    // In a real app, this would trigger payment
    toast.success(`即将跳转支付页面...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-pink-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">我的钱包</h1>
        </div>
      </div>

      {/* Balance Card */}
      <div className="max-w-lg mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">账户余额</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{balance}</span>
                <span className="text-sm text-gray-500">金币</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-yellow-500" />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors">
              充值
            </button>
            <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
              提现
            </button>
          </div>
        </div>
      </div>

      {/* Recharge Packages */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">充值套餐</h2>
        <div className="grid grid-cols-2 gap-3">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePurchase(pkg)}
              className="bg-white rounded-xl p-4 text-left border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🪙</span>
                <span className="text-xl font-bold text-gray-900">{pkg.coins}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-primary-500 font-semibold">¥{pkg.price}</span>
                {pkg.bonus > 0 && (
                  <span className="text-xs text-orange-500 ml-1">+{pkg.bonus}赠送</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-lg mx-auto px-4 pb-6">
        <div className="bg-white rounded-xl divide-y divide-gray-100">
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-500" />
              </div>
              <span className="font-medium text-gray-900">我的银行卡</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                <Gift className="w-5 h-5 text-pink-500" />
              </div>
              <span className="font-medium text-gray-900">礼物记录</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <History className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-medium text-gray-900">交易记录</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-purple-500" />
              </div>
              <span className="font-medium text-gray-900">帮助中心</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="max-w-lg mx-auto px-4 pb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">最近交易</h2>
        <div className="bg-white rounded-xl divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{tx.desc}</p>
                <p className="text-xs text-gray-400">{tx.time}</p>
              </div>
              <span className={`font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-gray-700'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;