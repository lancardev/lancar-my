// project.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicnVtb2VucHZma2F1cGthcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI1MTMsImV4cCI6MjA2MDQ2ODUxM30.1g5OfqUxr-9MqeeMRH11upocQZLVvJCCNi7nbvu2iD8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('project-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('project-title').value.trim();
    const code  = document.getElementById('project-code').value;

    if (!title || !code) {
      return alert('Both title and code are required.');
    }

    // 1) Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User not logged in', userError);
      return alert('You must be signed in to create a project.');
    }

    // 2) Insert the new project row
    const { data, error: insertError } = await supabase
      .from('projects')
      .insert([{
        user_id: user.id,
        title,
        code
      }])
      .select()    // optional: return the inserted row
      .single();

    if (insertError) {
      console.error('Project insert error', insertError);
      return alert('Failed to create project: ' + insertError.message);
    }

    // 3) Redirect to the subdomain
    window.location.href = `https://${encodeURIComponent(title)}.lancar-my.vercel.app`;
  });
});
