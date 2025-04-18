// Initialize Supabase client
const supabaseUrl = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Wait until the window has loaded before attaching event listeners
window.onload = function() {
    // Handle Sign-Up Button Click
    document.getElementById('sign-up-button').addEventListener('click', async function() {
        const email = prompt("Enter your email:");  // Prompt user for email
        const password = prompt("Enter your password:");  // Prompt user for password

        // Perform the sign-up operation with Supabase
        const { user, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            alert('Error during sign-up: ' + error.message);
        } else {
            alert('Please check your email for the authentication link!');

            // After sign-up, generate a referral code and save data in the 'users' table
            const referralCode = 'USER' + Math.random().toString(36).substring(2, 10).toUpperCase();

            const { data, insertError } = await supabase
                .from('users')
                .insert([
                    { 
                        user_id: user.id,  // Link with the Supabase user ID
                        referral_code: referralCode,
                        commission_balance: 0,  // Start with 0 commission balance
                    }
                ]);

            if (insertError) {
                alert('Error saving user data: ' + insertError.message);
            } else {
                window.location.href = 'payment-page.html';  // Redirect to the payment page
            }
        }
    });
};
