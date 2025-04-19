// 1) Import the ESM bundle
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 2) Your Supabase creds (paste the full key, no ellipses)
const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';

// 3) Initialize the client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', async () => {
  // 4) Get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    alert('Not signed in – redirecting to homepage.');
    return window.location.href = 'index.html';
  }
  const user = session.user;

  // 5) Try to fetch their "users" row (maybeSingle → no error if empty)
  let { data: record, error: fetchError } = await supabase
    .from('users')
    .select('referral_code, commission_balance, email')
    .eq('user_id', user.id)
    .maybeSingle();
  if (fetchError) {
    console.error('Error fetching dashboard data:', fetchError);
    return alert('Could not load your dashboard data.');
  }

  // 6) If they don’t yet have a row (first‐time login), insert one
  if (!record) {
    const referralCode = 'USER' + Math.random().toString(36).slice(2, 10).toUpperCase();
    const { data: inserted, error: insertError } = await supabase
      .from('users')
      .insert([{
        user_id: user.id,
        email: user.email,
        referral_code: referralCode,
        commission_balance: 0,
        subscription_status: 'active',
        subscription_plan: 'simulated-plan'
      }])
      .select()
      .single();
    if (insertError) {
      console.error('Error inserting new user record:', insertError);
      return alert('Could not save your dashboard data.');
    }
    record = inserted;
  }

  // 7) Display the referral code & commission
  document.getElementById('referral-code').textContent = record.referral_code;
  document.getElementById('commission-balance').textContent =
    parseFloat(record.commission_balance).toFixed(2);
});
