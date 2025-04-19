// project.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cbrumoenpvfkaupkarzt.supabase.co';
const SUPABASE_KEY = 'YOUR_FULL_ANON_KEY_HERE';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('project-form').addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('project-title').value.trim();
    const code  = document.getElementById('project-code').value;

    if (!title || !code) return alert('Both title and code are required.');

    // Insert into projects table
    const { error } = await supabase
      .from('projects')
      .insert([{ 
        user_id: supabase.auth.session().user.id, 
        title, 
        code 
      }]);

    if (error) {
      console.error('Insert error:', error);
      return alert('Failed to create project: ' + error.message);
    }

    // Redirect to the new subdomain
    window.location.href = `https://${title}.lancar-my.vercel.app`;
  });
});
