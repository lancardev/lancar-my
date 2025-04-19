// dashboard.js
const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', async () => {
  // 1) Get the current user
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    alert('Not signed in – redirecting to homepage.');
    return window.location.href = 'index.html';
  }

  // 2) Fetch their record from "users" table
  const { data, error: fetchError } = await supabaseClient
    .from('users')
    .select('referral_code, commission_balance')
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    console.error('❌ fetchError', fetchError);
    return alert('Could not load your dashboard data.');
  }

  // 3) Display it
  document.getElementById('referral-code').textContent       = data.referral_code;
  document.getElementById('commission-balance').textContent = parseFloat(data.commission_balance).toFixed(2);
});
