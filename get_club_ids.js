const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getIds() {
  const clubNames = ['SKY72 골프클럽(바다코스)', '88CC', '사우스링스영암'];
  const { data, error } = await supabase.from('golf_clubs').select('id, name').in('name', clubNames);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
    
    // Also get a sample course for each
    for (const club of data) {
       const { data: courses } = await supabase.from('golf_courses').select('id, name').eq('golf_club_id', club.id).limit(1);
       if (courses && courses.length > 0) {
         console.log(`Club: ${club.name}, Course: ${courses[0].name}, ID: ${courses[0].id}`);
       }
    }
  }
}
getIds();
