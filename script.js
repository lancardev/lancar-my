// Initialize Supabase client (make sure to replace with your actual credentials)
const supabaseUrl = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Handle Sign-Up Button Click
document.getElementById('sign-up-button').addEventListener('click', async function() {
    // Prompt user for email and password
    const email = prompt("Enter your email:");  
    const password = prompt("Enter your password:");

    // Perform the sign-up operation with Supabase
    const { user, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        // If there's an error during sign-up, show the error message
        alert('Error during sign-up: ' + error.message);
    } else {
        // Successful sign-up - display a message and ask the user to check their email
        alert('Please check your email for the authentication link!');

        // After sign-up, generate a referral code and save the user's details to the 'users' table
        const referralCode = 'USER' + Math.random().toString(36).substring(2, 10).toUpperCase();

        const { data, insertError } = await supabase
            .from('users')
            .insert([
                { 
                    user_id: user.id,  // Link with the Supabase user ID
                    referral_code: referralCode,
                    commission_balance: 0,  // Set initial commission balance to 0
                }
            ]);

        if (insertError) {
            // Handle any errors saving user data to the 'users' table
            alert('Error saving user data: ' + insertError.message);
        } else {
            // Redirect the user to the payment page after sign-up
            window.location.href = 'payment-page.html'; 
        }
    }
});
