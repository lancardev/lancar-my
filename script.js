// 1) Grab the global Supabase object from window
const { createClient } = window.supabase;

// 2) Initialize your client under a new name
const supabaseClient = createClient(
  'https://cbrumoenpvfkaupkarzt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi…'
);

console.log('✅ supabaseClient ready:', supabaseClient);

window.onload = () => {
  console.log('🖼 Window loaded');

  document.getElementById('sign-up-button').addEventListener('click', async () => {
    console.log('👉 Sign‑Up button clicked');

    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    console.log('🧑‍💻 creds', { email, password });

    // Use *supabaseClient* instead of `supabase`
    const { user, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      alert('Sign‑up error: ' + error.message);
      return;
    }
    alert('✔️ Check your email for the confirmation link!');

    const referralCode = 'USER' + Math.random().toString(36).slice(2, 10).toUpperCase();
    console.log('🔑 referralCode:', referralCode);

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
      alert('DB error: ' + insertError.message);
    } else {
      window.location.href = 'payment-page.html';
    }
  });
};
