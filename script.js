// 1) Your Supabase credentials
const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';

// 2) Wait for the DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM loaded');

  // 3) Check that the UMD bundle exposed the global properly
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('❌ window.supabase.createClient is NOT available');
    return;
  }

  // 4) Initialize your Supabase client
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('🔑 supabaseClient ready:', supabaseClient);

  // 5) Wire up the Sign Up button
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

    // 7) Call Supabase signUp
    const { user, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      console.error('⚠️ signUp error', error);
      alert('Sign‑up error: ' + error.message);
      return;
    }
    alert('✅ Check your email for the confirmation link!');

    // 8) Generate referral & save in your table
    const referralCode = 'USER' + Math.random().toString(36).slice(2, 10).toUpperCase();
    console.log('🔑 referralCode', referralCode);

    const { data, insertError } = await supabaseClient
      .from('users')
      .insert([{
        user_id: user.id,
        email,
        referral_code: referralCode,
        subscription_status: 'pending',
        subscription_plan: 'free',
      }]);

    if (insertError) {
      console.error('⚠️ insertError', insertError);
      alert('DB error: ' + insertError.message);
      return;
    }

    // 9) All set: redirect to payment
    window.location.href = 'payment-page.html';
  });
});
