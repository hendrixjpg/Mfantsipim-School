import React, { useState, useEffect } from 'react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail,
  signOutUser,
  onAuthStateChange,
  checkDomainAuthorization
} from '@/src/services/authService';
import { LogIn, Mail, Lock, AlertCircle, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { User as FirebaseUser } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domainWarning, setDomainWarning] = useState(false);

  // Check domain on mount
  useEffect(() => {
    const isAuthorized = checkDomainAuthorization();
    setDomainWarning(!isAuthorized);
  }, []);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChange((authState) => {
      setUser(authState.user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setError(null);
    
    const result = await signInWithGoogle();
    
    if (!result.success && result.error) {
      setError(result.error.message);
      
      // If domain error, show detailed fix instructions
      if (result.error.code === 'auth/unauthorized-domain') {
        setError(
          `🚫 Domain Not Authorized!\n\n` +
          `Add "${window.location.hostname}" to:\n` +
          `Firebase Console → Authentication → Settings → Authorized Domains\n\n` +
          `Then refresh the page.`
        );
      }
    }
    
    setSubmitting(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setError(null);

    let result;
    if (isLogin) {
      result = await signInWithEmail(email, password);
    } else {
      result = await signUpWithEmail(email, password);
    }

    if (!result.success && result.error) {
      setError(result.error.message);
    }

    setSubmitting(false);
  };

  const handleSignOut = async () => {
    setSubmitting(true);
    await signOutUser();
    setSubmitting(false);
  };

  // Show loading spinner during initial check
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <span className="text-sm font-mono text-zinc-500 tracking-wider uppercase">Authenticating connection...</span>
      </div>
    );
  }

  // Show user info if logged in
  if (user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl text-center" id="user-profile-card">
        <div className="flex flex-col items-center">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User Profile'} 
              className="w-20 h-20 rounded-full border-4 border-red-100 shadow-md object-cover mb-4 referrerPolicy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-3xl mb-4 border border-red-200">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-black font-display tracking-tight text-zinc-900 mb-1">
            Welcome, {user.displayName || user.email}!
          </h2>
          <p className="text-sm font-mono text-zinc-500 mb-8">{user.email}</p>
          
          <div className="w-full p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-left mb-8">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold font-mono tracking-widest uppercase mb-1">
              <CheckCircle2 size={14} /> Connected Session
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              You are logged in and authorized to access directory services. Persistence is set to local.
            </p>
          </div>

          <button 
            disabled={submitting}
            onClick={handleSignOut} 
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-6 rounded-xl transition duration-150 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            id="sign-out-button"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing Out...
              </>
            ) : (
              'Sign Out'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Login/Signup Form
  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl" id="auth-main-card">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black font-display tracking-tight text-zinc-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-zinc-500">
          {isLogin ? 'Sign in to connect with alumni and updates' : 'Join our official school network today'}
        </p>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-800" id="auth-error-alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div className="text-xs font-medium whitespace-pre-line leading-relaxed">
            {error}
          </div>
        </div>
      )}

      {/* Google Button */}
      <button 
        onClick={handleGoogleSignIn} 
        disabled={submitting}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 hover:border-zinc-300 font-bold py-3 px-6 rounded-xl transition duration-150 active:scale-95 cursor-pointer disabled:opacity-50"
        id="google-signin-button"
      >
        {submitting ? (
          <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
              <path d="M12,20.5c2.43,0 4.47,-0.8 5.96,-2.02l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.3,0.98 -2.34,0 -4.33,-1.58 -5.04,-3.7H2.9v2.66C4.38,18.78 7.92,20.5 12,20.5z" fill="#34A853" />
              <path d="M6.96,13.18C6.78,12.66 6.68,12.1 6.68,11.5c0,-0.6 0.1,-1.16 0.28,-1.68V7.16H2.9C2.3,8.36 2,9.7 2,11.5c0,1.8 0.3,3.14 0.9,4.34L6.96,13.18z" fill="#FBBC05" />
              <path d="M12,4.82c1.32,0 2.51,0.45 3.44,1.35L18,3.64C16.47,2.2 14.43,1.3 12,1.3c-4.08,0 -7.62,1.72 -9.1,4.54l4.06,3.16c0.71,-2.12 2.7,-3.7 5.04,-3.7z" fill="#EA4335" />
            </g>
          </svg>
        )}
        <span className="text-sm tracking-wide">{submitting ? 'Redirecting...' : 'Continue with Google'}</span>
      </button>

      {domainWarning && (
        <p className="text-[10px] text-amber-600 dark:text-amber-500 font-semibold mt-2.5 leading-snug text-center">
          ⚠️ Note: "{window.location.hostname}" is not configured in Firebase Console for Google login. Try Email/Password details below if Google fails.
        </p>
      )}

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-zinc-200"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold tracking-wider font-mono text-zinc-400 uppercase">Or</span>
        <div className="flex-grow border-t border-zinc-200"></div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label className="block text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase mb-2">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 px-4 py-3 pl-10 rounded-xl text-sm transition duration-150 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold font-mono tracking-widest text-zinc-500 uppercase mb-2">Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Lock size={18} />
            </span>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={submitting}
              className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 px-4 py-3 pl-10 rounded-xl text-sm transition duration-150 outline-none"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-600/10"
          id="email-auth-submit-button"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <LogIn size={16} />
              {isLogin ? 'Sign In' : 'Sign Up'}
            </>
          )}
        </button>
      </form>

      {/* Switch Form Toggle */}
      <div className="text-center mt-8">
        <button 
          className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline transition-all cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
          disabled={submitting}
          id="toggle-auth-button"
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}
