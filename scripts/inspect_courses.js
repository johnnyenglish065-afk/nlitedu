const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('courses')
    .select('slug, title, program_type');
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Total courses:", data.length);
  console.log("Courses:", JSON.stringify(data, null, 2));
}

run();
