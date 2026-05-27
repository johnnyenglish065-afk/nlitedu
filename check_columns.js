const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, count, error } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact' });
  if (error) {
    console.error(error);
  } else {
    console.log("Count:", count);
    if (data && data.length > 0) {
      console.log("Keys of first record:", Object.keys(data[0]));
      console.log("Sample record:", data[0]);
    } else {
      console.log("No records found.");
    }
  }
}
run();
