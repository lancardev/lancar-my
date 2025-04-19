// 1) Supabase init
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';

const supabase = createClient(URL, KEY);

window.addEventListener('DOMContentLoaded', () => {
  // -- SIGN UP --
  document.getElementById('sign-up-button').addEventListener('click', async () => {
    const email    = prompt('Enter your email:');
    const password = prompt('Choose a password:');
    if (!email || !password) return alert('Email & password required.');

    const { data: { user }, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.includes('User already registered')) {
        return alert('You already have an account. Please use Log In.');
      }
      return alert('Sign‑up error: ' + error.message);
    }

    // immediate referral for Phase 1
    const code = 'USER' + Math.random().toString(36).slice(2,10).toUpperCase();
    await supabase.from('users').insert([{
      user_id: user.id,
      email,
      referral_code: code,
      subscription_status: 'active',
      subscription_plan: 'simulated-plan'
    }]);

    window.location.href = 'dashboard.html';
  });

  // -- LOG IN --
  document.getElementById('login-button').addEventListener('click', async () => {
    const email    = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (!email || !password) return alert('Email & password required.');

    const { data: session, error } = await supabase.auth.signInWithPassword({
      email, password
    });
    if (error) {
      return alert('Log‑in error: ' + error.message);
    }

    // successful login → go to dashboard
    window.location.href = 'dashboard.html';
  });
});
