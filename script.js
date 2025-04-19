// script.js
// 1) Pull in createClient from the module build
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 2) Supabase credentials
const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';

// 3) Initialize the client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 4) When the page loads, wire up the button
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('sign-up-button');
  if (!btn) return console.error('❌ #sign-up-button not found');

  btn.addEventListener('click', async () => {
    // 5) Prompt for email/password
    const email    = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (!email || !password) {
      return alert('Email & password are required.');
    }

    // 6) Create the Auth user
    const { data: { user }, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('⚠️ signUp error', error);
      return alert('Sign‑up error: ' + error.message);
    }

    // 7) Immediately generate & store referral
    const referralCode = 'USER' + Math.random().toString(36).slice(2,10).toUpperCase();
    const { error: insertError } = await supabase
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

    // 8) Redirect to dashboard
    alert('✔️ You’re signed up! Redirecting to your dashboard…');
    window.location.href = 'dashboard.html';
  });
});
