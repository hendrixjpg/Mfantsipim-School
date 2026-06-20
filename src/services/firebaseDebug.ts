import firebaseConfig from '../../firebase-applet-config.json';

export interface FirebaseDebugResult {
  currentDomain: string;
  isLocalhost: boolean;
  isPreview: boolean;
  needsDomainAuth: boolean;
  recommendedActions: string[];
}

export const debugFirebase = (): FirebaseDebugResult => {
  console.group('🔍 Firebase Debug Info');
  
  // 1. Check current domain
  const domain = window.location.hostname;
  console.log('📌 Current Domain:', domain);
  
  // 2. Check if using correct environment
  const isLocalhost = domain === 'localhost' || domain === '127.0.0.1';
  const isPreview = domain.includes('ai-studio-preview.goog') || domain.includes('usercontent.goog') || domain.includes('run.app');
  console.log('🏠 Environment:', isLocalhost ? 'Localhost' : isPreview ? 'AI Studio Preview' : 'Production');
  
  // 3. Check Firebase config
  console.log('📋 Firebase Config:', {
    authDomain: firebaseConfig?.authDomain || 'Not set',
    projectId: firebaseConfig?.projectId || 'Not set'
  });
  
  // 4. Check auth persistence
  console.log('💾 Auth Persistence:', localStorage.getItem('firebase:authUser') ? 'Local' : 'Session/None');
  
  // 5. Check for errors in console
  console.log('⚠️ Check console for red error messages above');
  
  // 6. Provide fix instructions if domain issue
  const projectId = firebaseConfig?.projectId || 'YOUR_PROJECT_ID';
  const consoleSettingsUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;
  
  console.log('🔗 Firebase Console Authentication Settings:');
  console.log(`📌 Link: ${consoleSettingsUrl}`);

  const needsDomainAuth = !isLocalhost && !isPreview;
  if (needsDomainAuth) {
    console.warn('⚠️ You may need to add this domain to Firebase Authorized Domains');
    console.info(`🔧 Go to: ${consoleSettingsUrl}`);
    console.info(`📌 Click "Authorized Domains" -> "Add Domain" -> Add: ${domain}`);
  }
  
  console.groupEnd();
  
  // Return recommended actions
  return {
    currentDomain: domain,
    isLocalhost,
    isPreview,
    needsDomainAuth,
    recommendedActions: needsDomainAuth ? [
      `Add "${domain}" to Firebase Console → Authentication → Settings → Authorized Domains`,
      'Refresh the page after adding the domain',
      'Clear browser cache and cookies'
    ] : []
  };
};

// Expose globally on the window object
if (typeof window !== 'undefined') {
  (window as any).debugFirebase = debugFirebase;
}
