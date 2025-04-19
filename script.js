// script.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';  // <-- paste entire key!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', () => {
  // Sign‑Up
  document.getElementById('sign-up-button').addEventListener('click', async () => {
    const email    = prompt('Enter your email:');
    const password = prompt('Choose a password:');
    if (!email || !password) return alert('Email & password required.');

    // 1) Create Auth user
    const { data: { user }, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return alert(
        error.message.includes('User already registered')
          ? 'You already have an account—please Log In.'
          : 'Sign‑up error: ' + error.message
      );
    }

    // 2) Immediately insert a record (id = user.id)
    const referralCode = 'USER' + Math.random().toString(36).slice(2,10).toUpperCase();
    const { error: insertErr } = await supabase
      .from('users')
      .insert([{
        id: user.id,                     // ← store in id column
        email,
        referral_code: referralCode,
        commission_balance: 0,
        subscription_status: 'active',
        subscription_plan: 'simulated-plan'
      }]);
    if (insertErr) {
      return alert('DB error: ' + insertErr.message);
    }

    // 3) Redirect
    window.location.href = 'dashboard.html';
  });

  // Log‑In
  document.getElementById('login-button').addEventListener('click', async () => {
    const email    = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (!email || !password) return alert('Email & password required.');

    const { data: session, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return alert('Log‑in error: ' + error.message);
    }
    window.location.href = 'dashboard.html';
  });
});
