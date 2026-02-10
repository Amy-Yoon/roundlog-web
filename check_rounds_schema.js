const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('rounds').select('*').limit(1);
  if (error) {
    console.error('Error fetching round:', error);
  } else {
    console.log('Sample round record keys:', data.length > 0 ? Object.keys(data[0]) : 'No data');
  }
}
check();
