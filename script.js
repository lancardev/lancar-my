// 1) Your Supabase credentials (no ellipses—paste this exactly)
const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';

// 2) Wait for DOM
window.addEventListener('DOMContentLoaded', () => {
  // 3) Grab the factory
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('❌ window.supabase.createClient not found');
    return;
  }

  // 4) Initialize client
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('🔑 supabaseClient ready');

  // 5) Wire up the sign-up button
  const btn = document.getElementById('sign-up-button');
  if (!btn) {
    console.error('❌ No #sign-up-button');
    return;
  }

  btn.addEventListener('click', async () => {
    // 6) Prompt for credentials
    const email    = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (!email || !password) return alert('Email & password required.');

    // 7) Sign up
    const { user, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      console.error('⚠️ signUp error', error);
      return alert('Sign‑up error: ' + error.message);
    }

    // 8) Simulate “paid” and generate referral immediately
    const referralCode = 'USER' + Math.random().toString(36).slice(2, 10).toUpperCase();
    const { insertError } = await supabaseClient
      .from('users')
      .insert([{
        user_id: user.id,
        email,
        referral_code: referralCode,
        subscription_status: 'active',
        subscription_plan: 'simulated-plan'
      }]);
    if (insertError) {
      console.error('⚠️ insertError', insertError);
      return alert('DB error: ' + insertError.message);
    }

    // 9) Redirect to dashboard
    alert('Sign‑up successful! Redirecting to your dashboard…');
    window.location.href = 'dashboard.html';
  });
});
