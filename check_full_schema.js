const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  const tables = ['rounds', 'golf_courses', 'golf_course_holes', 'users'];
  for (const table of tables) {
    console.log(`--- Schema for ${table} ---`);
    const { data: columns, error } = await supabase.rpc('get_table_schema', { table_name: table }).catch(async () => {
        // If RPC doesn't exist, try a direct query (though REST might not allow information_schema)
        // Let's try to just select one and check keys as a fallback, but for constraints we need more.
        // Actually, let's just use the known structure from setup scripts if possible, 
        // OR try to fetch one record if it exists.
        return await supabase.from(table).select('*').limit(1);
    });
    
    if (columns && columns.data) {
        console.log(Object.keys(columns.data[0]));
    } else {
        // Fallback: try to get data and show keys
        const { data } = await supabase.from(table).select('*').limit(1);
        if (data && data.length > 0) {
            console.log('Keys:', Object.keys(data[0]));
        } else {
            console.log('Table empty or not accessible');
        }
    }
  }
}
checkSchema();
