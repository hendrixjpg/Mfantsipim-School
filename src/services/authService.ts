import { 
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export interface AuthErrorHandled {
  code: string;
  message: string;
  action: 'ADMIN_ACTION' | 'REDIRECT_SIGNUP' | 'REDIRECT_SIGNIN' | 'RETRY' | 'WAIT';
  original: any;
}

// Custom error handler for Firebase Auth errors
export const handleFirebaseAuthError = (error: any): AuthErrorHandled => {
  console.error("🔥 Firebase Auth Error:", error);
  
  const errorMap: Record<string, { message: string; action: 'ADMIN_ACTION' | 'REDIRECT_SIGNUP' | 'REDIRECT_SIGNIN' | 'RETRY' | 'WAIT' }> = {
    'auth/unauthorized-domain': {
      message: 'This domain is not authorized. Please add it to Firebase Console → Authentication → Settings → Authorized Domains.',
      action: 'ADMIN_ACTION'
    },
    'auth/user-not-found': {
      message: 'No user found with this email. Please sign up first.',
      action: 'REDIRECT_SIGNUP'
    },
    'auth/wrong-password': {
      message: 'Incorrect password. Please try again.',
      action: 'RETRY'
    },
    'auth/too-many-requests': {
      message: 'Too many failed attempts. Please try again later.',
      action: 'WAIT'
    },
    'auth/network-request-failed': {
      message: 'Network error. Please check your internet connection.',
      action: 'RETRY'
    },
    'auth/popup-closed-by-user': {
      message: 'Sign-in popup was closed. Please try again.',
      action: 'RETRY'
    },
    'auth/email-already-in-use': {
      message: 'This email is already registered. Please sign in.',
      action: 'REDIRECT_SIGNIN'
    },
    'auth/invalid-email': {
      message: 'Invalid email format. Please check your email.',
      action: 'RETRY'
    },
    'auth/operation-not-allowed': {
      message: 'Sign-in method not enabled. Please contact admin.',
      action: 'ADMIN_ACTION'
    }
  };

  const code = error?.code || '';
  const errorInfo = errorMap[code] || {
    message: `Authentication failed: ${error?.message || 'Unknown error'}`,
    action: 'RETRY'
  };

  return {
    code,
    message: errorInfo.message,
    action: errorInfo.action,
    original: error
  };
};

// Check if domain is authorized
export const checkDomainAuthorization = (): boolean => {
  const currentDomain = window.location.hostname;
  const authorizedDomains = [
    'localhost',
    '127.0.0.1',
    'ai-studio-preview.goog',
    'firebaseapp.com',
    'web.app',
    'usercontent.goog',
    'scf.usercontent.goog'
  ];
  
  // Check if current domain matches any authorized pattern
  const isAuthorized = authorizedDomains.some(domain => 
    currentDomain.includes(domain) || currentDomain === domain
  );
  
  if (!isAuthorized) {
    console.warn(`⚠️ Domain "${currentDomain}" may not be authorized.`);
    console.info('Add this domain to Firebase Console → Authentication → Settings → Authorized Domains');
  }
  
  return isAuthorized;
};

export interface SignInGoogleResult {
  success: boolean;
  user?: FirebaseUser;
  token?: string;
  error?: AuthErrorHandled;
}

// Sign in with Google Popup
export const signInWithGoogle = async (): Promise<SignInGoogleResult> => {
  try {
    checkDomainAuthorization();
    
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || undefined;
    const user = result.user;
    
    console.log('✅ Google Sign-In Successful:', user.email);
    return { success: true, user, token };
    
  } catch (error: any) {
    const handledError = handleFirebaseAuthError(error);
    
    if (error.code === 'auth/unauthorized-domain') {
      // Try to help user fix domain issue
      console.error('🚫 DOMAIN ERROR: Add your domain to Firebase Console');
      console.info('🔧 Go to: Firebase Console → Authentication → Settings → Authorized Domains');
      console.info(`📌 Add: ${window.location.hostname}`);
    }
    
    return { success: false, error: handledError };
  }
};

export interface EmailAuthResult {
  success: boolean;
  user?: FirebaseUser;
  error?: AuthErrorHandled;
}

// Sign in with Email/Password
export const signInWithEmail = async (email: string, password: string): Promise<EmailAuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Email Sign-In Successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    const handledError = handleFirebaseAuthError(error);
    return { success: false, error: handledError };
  }
};

// Sign up with Email/Password
export const signUpWithEmail = async (email: string, password: string): Promise<EmailAuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Sign-Up Successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    const handledError = handleFirebaseAuthError(error);
    return { success: false, error: handledError };
  }
};

export interface SignOutResult {
  success: boolean;
  error?: any;
}

// Sign out
export const signOutUser = async (): Promise<SignOutResult> => {
  try {
    await signOut(auth);
    console.log('✅ Sign-Out Successful');
    return { success: true };
  } catch (error) {
    console.error('❌ Sign-Out Error:', error);
    return { success: false, error };
  }
};

export interface AuthState {
  isAuthenticated: boolean;
  user: FirebaseUser | null;
}

// Listen for auth state changes
export const onAuthStateChange = (callback: (state: AuthState) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('👤 User is signed in:', user.email);
      callback({ isAuthenticated: true, user });
    } else {
      console.log('👤 User is signed out');
      callback({ isAuthenticated: false, user: null });
    }
  });
};
