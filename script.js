// 1) Your Supabase credentials
const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';

// 2) Wait for DOM ready
window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM loaded');

  // 3) Find the global Supabase factory
  let SupabaseFactory = window.supabase;
  if (!SupabaseFactory || typeof SupabaseFactory.createClient !== 'function') {
    // fallback if they exported under .default
    SupabaseFactory = window.supabase?.default || window.supabase?.supabase || null;
  }
  if (!SupabaseFactory || typeof SupabaseFactory.createClient !== 'function') {
    console.error('❌ Supabase factory not found:', window.supabase);
    return;
  }

  // 4) Initialize your client
  const supabaseClient = SupabaseFactory.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('🔑 supabaseClient ready:', supabaseClient);

  // 5) Wire up the button
  const btn = document.getElementById('sign-up-button');
  if (!btn) {
    console.error('❌ #sign-up-button not found');
    return;
  }
  console.log('🛠️ Attaching click handler to Sign Up button');

  btn.addEventListener('click', async () => {
    console.log('👉 Sign‑Up clicked');

    // 6) Prompt for credentials
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    console.log('🧑‍💻 creds', { email, password });

    // 7) Call Supabase
    const { user, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      console.error('⚠️ signUp error', error);
      alert('Sign‑up error: ' + error.message);
      return;
    }
    alert('✅ Check your email for the confirmation link!');

    // 8) Generate referral & save in your table
    const referralCode =
      'USER' + Math.random().toString(36).slice(2, 10).toUpperCase();
    console.log('🔑 referralCode', referralCode);

    const { data, insertError } = await supabaseClient
      .from('users')
      .insert([
        {
          user_id: user.id,
          email,
          referral_code: referralCode,
          subscription_status: 'pending',
          subscription_plan: 'free'
        }
      ]);

    if (insertError) {
      console.error('⚠️ insertError', insertError);
      alert('DB error: ' + insertError.message);
      return;
    }

    // 9) Done → payment
    window.location.href = 'payment-page.html';
  });
});
