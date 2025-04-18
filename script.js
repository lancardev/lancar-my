// Initialize Supabase client with your Supabase URL and Key
const supabaseUrl = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Log Supabase client initialization
console.log("Supabase client initialized", supabase);

// Ensure everything is ready before attaching event listeners
window.onload = function() {
    // Log window load
    console.log("Window loaded, ready to attach event listener.");

    // Handle Sign-Up Button Click
    document.getElementById('sign-up-button').addEventListener('click', async function() {
        // Log the Sign-Up button click
        console.log("Sign Up button clicked.");

        // Get email and password input from the user
        const email = prompt("Enter your email:");  // Prompt for email
        const password = prompt("Enter your password:");  // Prompt for password

        console.log("User email: ", email); // Log user email
        console.log("User password: ", password); // Log user password

        // Perform the sign-up operation with Supabase
        const { user, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            console.error('Error during sign-up:', error.message); // Log error if sign-up fails
            alert('Error during sign-up: ' + error.message);
        } else {
            console.log('Sign-up successful:', user); // Log success
            alert('Please check your email for the authentication link!');

            // After sign-up, generate a unique referral code
            const referralCode = 'USER' + Math.random().toString(36).substring(2, 10).toUpperCase();
            console.log("Generated Referral Code: ", referralCode);

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
                console.error('Error saving user data:', insertError.message); // Log any insert error
                alert('Error saving user data: ' + insertError.message);
            } else {
                console.log('User data saved successfully:', data);
                window.location.href = 'payment-page.html';  // Redirect to payment page after successful sign-up
            }
        }
    });
};
