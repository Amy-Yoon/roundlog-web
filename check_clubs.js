const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkClubs() {
    console.log('=== Checking Golf Clubs ===\n');

    const { data: clubs, error } = await supabase
        .from('golf_clubs')
        .select('id, name')
        .in('name', ['SKY72 골프클럽(바다코스)', '88CC'])
        .order('name');

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (!clubs || clubs.length === 0) {
        console.log('⚠️ SKY72 or 88CC not found in database!');
        console.log('The seed script needs these clubs to exist first.');
        console.log('\nPlease run supabase_setup_final.sql first to create golf clubs.');
    } else {
        console.log('✓ Found clubs:');
        clubs.forEach(c => {
            console.log(`  - ${c.name} (${c.id})`);
        });
    }
}

checkClubs();
