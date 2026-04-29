import { Crown, Zap, Heart, Sparkles, Check, Star, Gift, Users } from 'lucide-react';

const VIPPage = () => {
  const plans = [
    {
      id: 'monthly',
      name: '月度会员',
      price: 29.9,
      period: '月',
      originalPrice: 59.9,
      features: [
        '每日无限喜欢次数',
        '查看谁喜欢我',
        '超级喜欢每日 5 次',
        '优先匹配资格',
        '高级筛选功能',
        '专属会员标识',
      ],
      popular: false,
    },
    {
      id: 'yearly',
      name: '年度会员',
      price: 199,
      period: '年',
      originalPrice: 599,
      features: [
        '每日无限喜欢次数',
        '查看谁喜欢我',
        '超级喜欢每日 10 次',
        '优先匹配资格',
        '高级筛选功能',
        '专属会员标识',
        '年度专属礼包',
        '专属客服服务',
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1cmwoI3BhdHRlcm4tMSkiPjxwYXRoIGQ9Ik0zNiAwTDYwIDM2TDM2IDYwTDAgMzZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-lg mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Crown className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">HeartMatch VIP</h1>
          <p className="text-white/80">解锁全部功能，获得更好的匹配体验</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-lg mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">VIP 特权</h2>
        <div className="grid grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-3">
                {benefit.icon}
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">{benefit.title}</h3>
              <p className="text-xs text-gray-500">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-lg mx-auto px-4 pb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">选择套餐</h2>
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-5 shadow-sm border-2 ${
                plan.popular ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                  最受欢迎
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-primary-500">¥{plan.price}</span>
                    <span className="text-sm text-gray-400">/{plan.period}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">¥{plan.originalPrice}</span>
                  </div>
                </div>
                {plan.popular && (
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <span className="text-white text-xs font-bold">省 67%</span>
                  </div>
                )}
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:opacity-90'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                立即开通
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-lg mx-auto px-4 pb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">常见问题</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white rounded-xl p-4 group">
              <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                {faq.question}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-500">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

const benefits = [
  { icon: <Heart className="w-5 h-5 text-pink-500" />, title: '无限喜欢', desc: '每日无限次喜欢次数' },
  { icon: <Star className="w-5 h-5 text-yellow-500" />, title: '超级喜欢', desc: '更多超级喜欢机会' },
  { icon: <Zap className="w-5 h-5 text-blue-500" />, title: '优先匹配', desc: '优先展示给心仪用户' },
  { icon: <Sparkles className="w-5 h-5 text-purple-500" />, title: '专属标识', desc: '独特VIP身份标识' },
  { icon: <Gift className="w-5 h-5 text-green-500" />, title: '专属礼包', desc: '生日及节日礼包' },
  { icon: <Users className="w-5 h-5 text-orange-500" />, title: '高级筛选', desc: '更多筛选条件' },
];

const faqs = [
  { question: 'VIP会员如何开通？', answer: '选择套餐后，通过微信或支付宝完成支付即可立即开通。' },
  { question: '会员到期后如何处理？', answer: '会员到期后，您的数据不会丢失，但会员特权将暂停。' },
  { question: '如何取消自动续费？', answer: '可以在设置中关闭自动续费，或者联系客服取消。' },
  { question: '支付安全吗？', answer: '支付通过官方渠道，支持微信、支付宝，安全性有保障。' },
];

export default VIPPage;