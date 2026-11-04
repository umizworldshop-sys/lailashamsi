import { useState, useEffect } from 'react';
import { 
  CloseIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon 
} from '../Icons';
import { 
  checkAdminSetup, 
  registerAdmin, 
  loginAdmin 
} from '../../services/api';

export default function AdminAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [view, setView] = useState('loading'); // 'loading' | 'register' | 'login'
  const [hasAdminExists, setHasAdminExists] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

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

  useEffect(() => {
    if (!isOpen) return;

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
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await loginAdmin({
        email: loginForm.email,
        password: loginForm.password
      });

      if (res && res.success && res.token) {
        setHasAdminExists(true);
        onAuthSuccess({ token: res.token, admin: res.admin });
      } else {
        throw new Error(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-radial from-[#1A1115] via-[#0E0B0D] to-[#050405] relative overflow-y-auto">
      {/* Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B76E79]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors cursor-pointer"
        title="Return to Storefront"
      >
        <CloseIcon className="w-5 h-5" />
      </button>

      {/* VIEW: LOADING */}
      {view === 'loading' && (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-mono tracking-[0.25em] text-gray-400">
            Connecting Database...
          </p>
        </div>
      )}

      {/* VIEW: ONE-TIME MASTER ADMIN REGISTRATION */}
      {view === 'register' && (
        <div className="relative w-full max-w-lg bg-[#141216]/95 border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-2 mb-7">
            <img 
              src="/Logo.jpeg" 
              alt="Laila Shamsi" 
              className="w-14 h-14 rounded-2xl object-contain border border-[#D4AF37]/50 shadow-xl mx-auto"
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] block">
              Online Database Setup
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide">
              Master Admin Registration
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
              Register the administrator for Laila Shamsi. Your account will be safely stored in the online MongoDB database. Once registered, registration closes permanently.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <div className="flex-1">{authError}</div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                Administrator Name *
              </label>
              <input
                type="text"
                required
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl px-4 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                Admin Email *
              </label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="e.g. admin@lailashamsi.com"
                className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl px-4 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl pl-4 pr-11 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] p-1 transition-colors cursor-pointer"
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
                <label className="text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showRegisterConfirmPassword ? 'text' : 'password'}
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl pl-4 pr-11 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] p-1 transition-colors cursor-pointer"
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
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#B76E79] to-[#8E4453] hover:from-[#c27c87] hover:to-[#9f4f5f] text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {authLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Register Admin</span>
              )}
            </button>

            <div className="pt-3 text-center">
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
        <div className="relative w-full max-w-md bg-[#141216]/95 border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-2 mb-8">
            <img 
              src="/Logo.jpeg" 
              alt="Laila Shamsi" 
              className="w-14 h-14 rounded-2xl object-contain border border-[#D4AF37]/50 shadow-xl mx-auto"
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] block">
              Admin Access
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-white tracking-wide">
              Admin Login
            </h2>
            <p className="text-xs text-gray-400">
              Enter your admin credentials to access catalog management and customer orders.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-start gap-2">
              <span className="shrink-0 mt-0.5">⚠️</span>
              <div className="flex-1">{authError}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                Admin Email *
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="e.g. admin@lailashamsi.com"
                className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl px-4 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-gray-300 block mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter admin password"
                  className="w-full bg-[#1C1920] border border-[#332E38] rounded-xl pl-4 pr-11 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] p-1 transition-colors cursor-pointer"
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
              disabled={authLoading}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#B76E79] to-[#8E4453] hover:from-[#c27c87] hover:to-[#9f4f5f] text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {authLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="pt-3 text-center border-t border-[#332E38]/50 mt-4">
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
                <p className="text-[11px] text-[#D4AF37]/80 flex items-center justify-center gap-1.5 font-medium">
                  <LockIcon className="w-3.5 h-3.5 text-[#D4AF37]" /> Registration locked (Admin account configured in online database)
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

