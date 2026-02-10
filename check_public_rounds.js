const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkPublicRounds() {
    console.log('=== Checking Public Rounds ===\n');

    // Check all rounds
    const { data: allRounds, error: allError } = await supabase
        .from('rounds')
        .select('id, date, club_name, course_name, total_score, is_public, user_id')
        .order('date', { ascending: false });

    if (allError) {
        console.error('Error fetching all rounds:', allError);
        return;
    }

    console.log(`Total rounds in database: ${allRounds?.length || 0}`);

    if (allRounds && allRounds.length > 0) {
        console.log('\nAll rounds:');
        allRounds.forEach((r, i) => {
            console.log(`${i + 1}. ${r.date} | ${r.club_name} | ${r.course_name} | Score: ${r.total_score} | Public: ${r.is_public} | User: ${r.user_id}`);
        });
    }

    // Check public rounds specifically
    const { data: publicRounds, error: publicError } = await supabase
        .from('rounds')
        .select('*')
        .eq('is_public', true)
        .order('date', { ascending: false });

    if (publicError) {
        console.error('\nError fetching public rounds:', publicError);
        return;
    }

    console.log(`\n\nPublic rounds (is_public=true): ${publicRounds?.length || 0}`);

    if (publicRounds && publicRounds.length > 0) {
        console.log('\nPublic rounds details:');
        publicRounds.forEach((r, i) => {
            console.log(`${i + 1}. ${r.date} | ${r.club_name} | ${r.course_name} | Score: ${r.total_score}`);
        });
    } else {
        console.log('\n⚠️ No public rounds found! The is_public column might not be set to true.');
    }

    // Check users
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, email');

    if (!usersError && users) {
        console.log(`\n\nTotal users: ${users.length}`);
        users.forEach((u, i) => {
            console.log(`${i + 1}. ${u.name} (${u.email}) - ID: ${u.id}`);
        });
    }
}

checkPublicRounds();
