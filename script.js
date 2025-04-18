// Initialize Supabase client with your URL and API key
const supabaseUrl = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Ensure everything is ready before attaching event listeners
window.onload = function() {
    // Attach event listener to the "Sign Up" button
    document.getElementById('sign-up-button').addEventListener('click', async function() {
        // Get email and password input from the user
        const email = prompt("Enter your email:");  // Prompt for email
        const password = prompt("Enter your password:");  // Prompt for password

        // Use Supabase to sign up the user
        const { user, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            alert('Error during sign-up: ' + error.message);  // Show error message if sign-up fails
        } else {
            alert('Please check your email for the authentication link!');  // Inform the user to check their email

            // After sign-up, generate a unique referral code
            const referralCode = 'USER' + Math.random().toString(36).substring(2, 10).toUpperCase();

            // Insert the user data into the 'users' table
            const { data, insertError } = await supabase
                .from('users')
                .insert([
                    { 
                        user_id: user.id,  // Link user ID from Supabase
                        email: email,  // Store the email
                        referral_code: referralCode,  // Store the generated referral code
                        subscription_status: 'pending',  // Initial subscription status
                        subscription_plan: 'free',  // Default plan
                    }
                ]);

            if (insertError) {
                alert('Error saving user data: ' + insertError.message);  // Handle any errors inserting data
            } else {
                window.location.href = 'payment-page.html';  // Redirect to payment page after successful sign-up
            }
        }
    });
};
