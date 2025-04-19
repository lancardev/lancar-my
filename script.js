// script.js
// 1) Supabase credentials
const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('sign-up-button');
  if (!btn) return console.error('#sign-up-button not found');

  btn.addEventListener('click', async () => {
    // 2) Gather credentials
    const email    = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (!email || !password) return alert('Email & password required.');

    // 3) Create the Auth user
    const { user, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      console.error('❌ signUp error', error);
      return alert('Sign‑up error: ' + error.message);
    }

    // 4) Immediately generate referral & insert into your table
    const referralCode = 'USER' + Math.random().toString(36).slice(2,10).toUpperCase();
    const { data, insertError } = await supabaseClient
      .from('users')
      .insert([{
        user_id: user.id,
        email,
        referral_code: referralCode,
        subscription_status: 'active',      // mark as “paid” for now
        subscription_plan: 'simulated-plan'
      }]);
    if (insertError) {
      console.error('❌ insertError', insertError);
      return alert('DB error: ' + insertError.message);
    }

    // 5) Success → go to dashboard
    alert('Sign‑up successful! Redirecting to your dashboard…');
    window.location.href = 'dashboard.html';
  });
});
