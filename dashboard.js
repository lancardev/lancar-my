// dashboard.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', async () => {
  // 1) Get session
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr || !session) {
    alert('Please sign in first.');
    return window.location.href = 'index.html';
  }
  const user = session.user;

  // 2) Fetch or create record based on `id`
  let { data: record, error: fetchErr } = await supabase
    .from('users')
    .select('referral_code, commission_balance')
    .eq('id', user.id)   // ← use id
    .maybeSingle();

  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    return alert('Could not load your dashboard data.');
  }

  if (!record) {
    // Create it if missing
    const code = 'USER' + Math.random().toString(36).slice(2,10).toUpperCase();
    const { data: inserted, error: insErr } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        email: user.email,
        referral_code: code,
        commission_balance: 0,
        subscription_status: 'active',
        subscription_plan: 'simulated-plan'
      }])
      .select()
      .single();

    if (insErr) {
      console.error('Insert error:', insErr);
      return alert('Could not create your dashboard data.');
    }
    record = inserted;
  }

  // 3) Display
  document.getElementById('referral-code').textContent       = record.referral_code;
  document.getElementById('commission-balance').textContent = parseFloat(record.commission_balance).toFixed(2);
});
