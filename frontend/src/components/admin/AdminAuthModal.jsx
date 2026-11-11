import { useState, useEffect } from 'react';
import { 
  CloseIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon,
  AlertCircleIcon
} from '../Icons';
import { 
  checkAdminSetup, 
  registerAdmin, 
  loginAdmin 
} from '../../services/api';

const LOCKOUT_STORAGE_KEY = 'laila_admin_lockout_token';
const FAILED_ATTEMPTS_KEY = 'laila_admin_failed_attempts';

export default function AdminAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [view, setView] = useState('loading'); // 'loading' | 'register' | 'login'
  const [hasAdminExists, setHasAdminExists] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Brute Force Lockout & Token State
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Forms
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Password Visibility
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Check persistent lockout state from localStorage
  const checkLockoutStatus = () => {
    try {
      const stored = localStorage.getItem(LOCKOUT_STORAGE_KEY);
      if (!stored) {
        setIsLocked(false);
        setLockoutSeconds(0);
        return false;
      }
      const data = JSON.parse(stored);
      const now = Date.now();
      if (data && data.lockedUntil && data.lockedUntil > now) {
        const remaining = Math.max(1, Math.ceil((data.lockedUntil - now) / 1000));
        setIsLocked(true);
        setLockoutSeconds(remaining);
        return true;
      } else {
        localStorage.removeItem(LOCKOUT_STORAGE_KEY);
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
        setIsLocked(false);
        setLockoutSeconds(0);
        return false;
      }
    } catch {
      localStorage.removeItem(LOCKOUT_STORAGE_KEY);
      setIsLocked(false);
      setLockoutSeconds(0);
      return false;
    }
  };

  // Live countdown timer for active lockout
  useEffect(() => {
    if (!isLocked || lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          localStorage.removeItem(LOCKOUT_STORAGE_KEY);
          localStorage.removeItem(FAILED_ATTEMPTS_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked, lockoutSeconds]);

  useEffect(() => {
    if (!isOpen) return;

    checkLockoutStatus();

    let isMounted = true;
    const verifyStatus = async () => {
      setAuthLoading(true);
      setAuthError('');
      try {
        const setupRes = await checkAdminSetup();
        if (!isMounted) return;
        if (setupRes && setupRes.hasAdmin) {
          setHasAdminExists(true);
          setView('login');
        } else {
          setHasAdminExists(false);
          setView('register');
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn('Admin status check notice:', err);
        setHasAdminExists(false);
        setView('register');
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    verifyStatus();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (registerForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await registerAdmin({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password
      });

      if (res && res.success && res.token) {
        setHasAdminExists(true);
        onAuthSuccess({ token: res.token, admin: res.admin });
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      const errorMsg = err.message || 'Registration failed.';
      setAuthError(errorMsg);
      if (errorMsg.toLowerCase().includes('already') || errorMsg.toLowerCase().includes('locked')) {
        setHasAdminExists(true);
        setTimeout(() => setView('login'), 1200);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await loginAdmin({
        email: loginForm.email,
        password: loginForm.password
      });

      if (res && res.success && res.token) {
        // Successful login: Clear lockout tokens and failed attempts
        localStorage.removeItem(LOCKOUT_STORAGE_KEY);
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
        setIsLocked(false);
        setLockoutSeconds(0);
        setHasAdminExists(true);
        onAuthSuccess({ token: res.token, admin: res.admin });
      } else {
        throw new Error(res.message || 'Invalid email or password. Please verify both credentials.');
      }
    } catch (err) {
      const errData = err.data || {};
      const now = Date.now();

      // Case 1: Backend flagged brute-force lockout (status 429)
      if (errData.locked || err.status === 429) {
        const retrySec = errData.retryAfter || 60;
        const lockedUntil = now + retrySec * 1000;
        const lockoutToken = errData.lockoutToken || `sec_lock_${now}_${Math.random().toString(36).substring(2, 9)}`;

        localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify({
          token: lockoutToken,
          lockedUntil
        }));
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);

        setIsLocked(true);
        setLockoutSeconds(retrySec);
        setAuthError('');
        return;
      }

      // Case 2: Client-side tracking (syncs with 5 attempts max)
      let attempts = 0;
      try {
        const storedAttempts = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
        attempts = storedAttempts + 1;
        localStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());
      } catch {
        attempts = 1;
      }

      if (attempts >= 5) {
        const lockedUntil = now + 60 * 1000;
        const lockoutToken = `sec_lock_${now}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify({
          token: lockoutToken,
          lockedUntil
        }));
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);

        setIsLocked(true);
        setLockoutSeconds(60);
        setAuthError('');
        return;
      }

      const remaining = 5 - attempts;
      setAuthError(`Invalid email or password. Please verify both credentials. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center p-3 sm:p-6 py-6 sm:py-12 bg-radial from-[#1A1115] via-[#0E0B0D] to-[#050405] relative overflow-x-hidden overscroll-contain">
      {/* Contained Ambient Glows (Strictly clipped to prevent horizontal scroll) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#B76E79]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* VIEW: LOADING */}
      {view === 'loading' && (
        <div className="text-center space-y-4 my-auto relative z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] text-gray-400">
            Connecting Database...
          </p>
        </div>
      )}

      {/* VIEW: ONE-TIME MASTER ADMIN REGISTRATION */}
      {view === 'register' && (
        <div className="relative z-10 w-full max-w-[440px] mx-auto bg-[#141216]/98 border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Card Integrated Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors cursor-pointer"
            title="Return to Storefront"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          <div className="text-center space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
            <img 
              src="/logo.png" 
              alt="Umi'z World" 
              onError={(e) => {
                if (e.target.src.indexOf('Logo.jpeg') === -1) {
                  e.target.src = '/Logo.jpeg';
                }
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-contain border border-[#D4AF37]/50 shadow-xl mx-auto"
            />
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37] block">
              Online Database Setup
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
              Master Admin Registration
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed max-w-sm mx-auto px-1">
              Register the administrator for Umi&apos;z World. Account is stored in MongoDB Atlas. Once registered, registration locks permanently.
            </p>
          </div>

          {authError && (
            <div className="mb-4 sm:mb-5 p-3 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-start gap-2">
              <AlertCircleIcon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] sm:text-xs">{authError}</div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3 sm:space-y-3.5">
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                Administrator Name *
              </label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                Admin Email *
              </label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="e.g. admin@umizworld.com"
                className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl pl-3.5 pr-10 py-2.5 sm:py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] p-1.5 transition-colors cursor-pointer"
                    title={showRegisterPassword ? 'Hide password' : 'View password'}
                    aria-label={showRegisterPassword ? 'Hide password' : 'View password'}
                  >
                    {showRegisterPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showRegisterConfirmPassword ? 'text' : 'password'}
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl pl-3.5 pr-10 py-2.5 sm:py-3 text-sm text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] p-1.5 transition-colors cursor-pointer"
                    title={showRegisterConfirmPassword ? 'Hide password' : 'View password'}
                    aria-label={showRegisterConfirmPassword ? 'Hide password' : 'View password'}
                  >
                    {showRegisterConfirmPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-3 sm:py-3.5 bg-gradient-to-r from-[#B76E79] to-[#8E4453] hover:from-[#c27c87] hover:to-[#9f4f5f] text-white font-semibold text-xs uppercase tracking-[0.18em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {authLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Register Admin</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <p className="text-xs text-gray-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-[#D4AF37] hover:underline font-semibold ml-1 cursor-pointer"
                >
                  Sign In →
                </button>
              </p>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: MASTER ADMIN LOGIN */}
      {view === 'login' && (
        <div className="relative z-10 w-full max-w-[420px] mx-auto bg-[#141216]/98 border border-[#D4AF37]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Card Integrated Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors cursor-pointer"
            title="Return to Storefront"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-7">
            <img 
              src="/logo.png" 
              alt="Umi'z World" 
              onError={(e) => {
                if (e.target.src.indexOf('Logo.jpeg') === -1) {
                  e.target.src = '/Logo.jpeg';
                }
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-contain border border-[#D4AF37]/50 shadow-xl mx-auto"
            />
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37] block">
              Admin Access
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
              Admin Login
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 max-w-xs mx-auto">
              Enter your admin credentials to access catalog management and customer orders.
            </p>
          </div>

          {/* Unified Credential Alert (Only shown before lockout) */}
          {!isLocked && authError ? (
            <div className="mb-4 sm:mb-5 p-3 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-start gap-2">
              <AlertCircleIcon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] sm:text-xs">{authError}</div>
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                Admin Email *
              </label>
              <input
                type="email"
                required
                disabled={isLocked || authLoading}
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="e.g. admin@umizworld.com"
                className={`w-full bg-[#1C1920] border rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-white transition-colors ${
                  isLocked 
                    ? 'border-rose-900/40 opacity-40 cursor-not-allowed select-none bg-[#141014]' 
                    : 'border-[#332E38] focus:border-[#D4AF37] focus:outline-none'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  disabled={isLocked || authLoading}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter admin password"
                  className={`w-full bg-[#1C1920] border rounded-xl pl-3.5 pr-10 py-2.5 sm:py-3 text-sm text-white transition-colors ${
                    isLocked 
                      ? 'border-rose-900/40 opacity-40 cursor-not-allowed select-none bg-[#141014]' 
                      : 'border-[#332E38] focus:border-[#D4AF37] focus:outline-none'
                  }`}
                />
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 transition-colors ${
                    isLocked 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-[#D4AF37] cursor-pointer'
                  }`}
                  title={showLoginPassword ? 'Hide password' : 'View password'}
                  aria-label={showLoginPassword ? 'Hide password' : 'View password'}
                >
                  {showLoginPassword ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLocked || authLoading}
              className={`w-full mt-3 sm:mt-4 py-3 sm:py-3.5 font-semibold text-xs uppercase tracking-[0.18em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                isLocked
                  ? 'bg-rose-950/60 text-rose-300/60 border border-rose-900/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#B76E79] to-[#8E4453] hover:from-[#c27c87] hover:to-[#9f4f5f] text-white cursor-pointer disabled:opacity-60'
              }`}
            >
              {isLocked ? (
                <div className="flex items-center gap-2">
                  <LockIcon className="w-4 h-4 text-rose-300" />
                  <span>Locked ({lockoutSeconds}s)</span>
                </div>
              ) : authLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="pt-3 text-center border-t border-[#332E38]/50 mt-3 sm:mt-4">
              {!hasAdminExists ? (
                <p className="text-xs text-gray-400">
                  Need initial setup?{' '}
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="text-[#D4AF37] hover:underline font-semibold ml-1 cursor-pointer"
                  >
                    Register Master Admin →
                  </button>
                </p>
              ) : (
                <p className="text-[10px] sm:text-[11px] text-[#D4AF37]/80 flex items-center justify-center gap-1.5 font-medium">
                  <LockIcon className="w-3.5 h-3.5 text-[#D4AF37]" /> Registration locked (Admin configured)
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
