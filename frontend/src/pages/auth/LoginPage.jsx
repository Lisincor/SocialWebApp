import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Heart, Send, Clock, Check, Lock, Smartphone, Eye, EyeOff, User, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    loginByAccount,
    loginBySms,
    sendVerificationCode,
    isLoading,
    error: storeError,
  } = useAuthStore();

  // 页面模式: 'login' 登录, 'register' 注册
  const [mode, setMode] = useState('login');
  // 登录方式: 'account' 账号密码, 'sms' 验证码
  const [loginType, setLoginType] = useState('account');

  // 步骤: 1-输入手机号, 2-验证后设置账户信息
  const [step, setStep] = useState(1);

  // 错误信息
  const [error, setError] = useState('');

  // ========== 登录字段 ==========
  const [loginPhone, setLoginPhone] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginCodeSent, setLoginCodeSent] = useState(false);
  const [loginCountdown, setLoginCountdown] = useState(0);

  // ========== 注册字段 ==========
  const [regPhone, setRegPhone] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regGender, setRegGender] = useState(1);
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regCodeSent, setRegCodeSent] = useState(false);
  const [regCountdown, setRegCountdown] = useState(0);

  // ========== 登录验证码 ==========
  const handleLoginSendCode = async () => {
    if (!loginPhone || loginPhone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    setError('');
    const success = await sendVerificationCode(loginPhone, 1);
    if (success) {
      setLoginCodeSent(true);
      setLoginCountdown(60);
      startCountdown(setLoginCountdown);
    }
  };

  // ========== 注册验证码 ==========
  const handleRegSendCode = async () => {
    if (!regPhone || regPhone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    setError('');
    const success = await sendVerificationCode(regPhone, 1);
    if (success) {
      setRegCodeSent(true);
      setRegCountdown(60);
      startCountdown(setRegCountdown);
    }
  };

  // 倒计时
  const startCountdown = (setCountdown) => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ========== 账号密码登录 ==========
  const handleAccountLogin = async () => {
    if (!loginUsername) {
      setError('请输入账户名');
      return;
    }
    if (!loginPassword || loginPassword.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }
    setError('');

    const success = await loginByAccount(loginUsername, loginPassword);
    if (success) {
      navigate('/');
    }
  };

  // ========== 验证码登录 ==========
  const handleSmsLogin = async () => {
    if (!loginPhone || loginPhone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    if (!loginCode || loginCode.length !== 6) {
      setError('请输入6位验证码');
      return;
    }
    setError('');

    const success = await loginBySms(loginPhone, loginCode);
    if (success) {
      navigate('/');
    }
  };

  // ========== 注册 ==========
  const handleRegister = async () => {
    // 验证
    if (!regPhone || regPhone.length !== 11) {
      setError('请输入正确的手机号');
      return;
    }
    if (!regCode || regCode.length !== 6) {
      setError('请输入6位验证码');
      return;
    }
    if (!regUsername || regUsername.length < 4) {
      setError('账户名长度需在4-20位');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(regUsername)) {
      setError('账户名只能包含字母、数字和下划线');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('密码长度需在6-20位');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setError('');
    const success = await register(
      regPhone,
      regCode,
      regUsername,
      regPassword,
      regNickname || regUsername,
      regGender
    );

    if (success) {
      navigate('/');
    }
  };

  // 切换模式
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setStep(1);
    // 重置字段
    setLoginPhone('');
    setLoginCode('');
    setLoginUsername('');
    setLoginPassword('');
    setLoginCodeSent(false);
    setLoginCountdown(0);
    setRegPhone('');
    setRegCode('');
    setRegUsername('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegNickname('');
    setRegGender(1);
    setRegCodeSent(false);
    setRegCountdown(0);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="pt-16 pb-8 px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">心动社交</h1>
        <p className="text-gray-500">遇见有趣的灵魂</p>
      </div>

      {/* Mode Tabs: 登录 / 注册 */}
      <div className="px-6 mb-4">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-white text-primary-500 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            <Lock className="w-4 h-4" />
            登录
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-white text-primary-500 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            注册
          </button>
        </div>
      </div>

      {/* ========== 登录表单 ========== */}
      {mode === 'login' && (
        <div className="flex-1 px-6 space-y-5">
          {/* 登录方式切换 */}
          <div className="flex bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => { setLoginType('account'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                loginType === 'account'
                  ? 'bg-white text-primary-500 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              账号密码
            </button>
            <button
              onClick={() => { setLoginType('sms'); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                loginType === 'sms'
                  ? 'bg-white text-primary-500 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              验证码
            </button>
          </div>

          {/* 账号密码登录 */}
          {loginType === 'account' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  账户名
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="请输入账户名"
                  className="input"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="input pr-10"
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleAccountLogin}
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>登录</span>
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm">
                没有账号？
                <button onClick={() => switchMode('register')} className="text-primary-500 hover:underline ml-1">
                  立即注册
                </button>
              </p>
            </div>
          )}

          {/* 验证码登录 */}
          {loginType === 'sms' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手机号
                </label>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="请输入手机号"
                  className="input"
                  maxLength={11}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  验证码
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入验证码"
                    className="input flex-1 text-center text-xl tracking-widest"
                    maxLength={6}
                  />
                  <button
                    onClick={handleLoginSendCode}
                    disabled={loginCodeSent ? loginCountdown > 0 : (loginPhone.length !== 11 || isLoading)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                      loginCodeSent && loginCountdown > 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {loginCountdown > 0 ? `${loginCountdown}s` : (loginCodeSent ? '重新发送' : '获取验证码')}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSmsLogin}
                disabled={!loginCodeSent || loginCode.length !== 6 || isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>登录</span>
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm">
                没有账号？
                <button onClick={() => switchMode('register')} className="text-primary-500 hover:underline ml-1">
                  立即注册
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========== 注册表单 ========== */}
      {mode === 'register' && (
        <div className="flex-1 px-6 space-y-5 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* 手机号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="请输入手机号"
                  className="input"
                  maxLength={11}
                />
              </div>

              {/* 验证码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  验证码 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入验证码"
                    className="input flex-1 text-center text-xl tracking-widest"
                    maxLength={6}
                  />
                  <button
                    onClick={handleRegSendCode}
                    disabled={regCodeSent ? regCountdown > 0 : (regPhone.length !== 11 || isLoading)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                      regCodeSent && regCountdown > 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {regCountdown > 0 ? `${regCountdown}s` : (regCodeSent ? '重新发送' : '获取验证码')}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!regPhone || regPhone.length !== 11) {
                    setError('请输入正确的手机号');
                    return;
                  }
                  if (!regCode || regCode.length !== 6) {
                    setError('请输入6位验证码');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>下一步：设置账户信息</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center py-2">
                <p className="text-gray-600">验证成功！</p>
                <p className="text-sm text-gray-500">请设置您的账户信息</p>
              </div>

              {/* 账户名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  账户名 <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 font-normal ml-2">(用于登录，唯一标识)</span>
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20))}
                  placeholder="4-20位字母、数字、下划线"
                  className="input"
                  maxLength={20}
                />
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={regShowPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="6-20位密码"
                    className="input pr-10"
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPassword(!regShowPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {regShowPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 确认密码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认密码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="input"
                  maxLength={20}
                />
              </div>

              {/* 昵称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  昵称 <span className="text-xs text-gray-400">(选填，展示用)</span>
                </label>
                <input
                  type="text"
                  value={regNickname}
                  onChange={(e) => setRegNickname(e.target.value.slice(0, 20))}
                  placeholder="给自己起个昵称"
                  className="input"
                  maxLength={20}
                />
              </div>

              {/* 性别 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性别 <span className="text-xs text-gray-400">(选填)</span>
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRegGender(1)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      regGender === 1
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    男
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegGender(2)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      regGender === 2
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    女
                  </button>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>完成注册</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-gray-500 text-sm hover:text-gray-700"
              >
                返回上一步
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {(error || storeError) && (
        <div className="px-6 py-3">
          <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
            {error || storeError}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="p-6 text-center text-xs text-gray-400">
        登录即表示同意
        <a href="#" className="text-primary-500">《用户协议》</a>
        和
        <a href="#" className="text-primary-500">《隐私政策》</a>
      </div>
    </div>
  );
};

export default LoginPage;
