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
  const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`;
  try {
    const res = await fetch(url);
    const schema = await res.json();
    const enrollmentsTable = schema.definitions?.enrollments;
    if (enrollmentsTable) {
      console.log("Enrollments Table Columns:");
      console.log(Object.keys(enrollmentsTable.properties).sort());
    } else {
      console.log("Enrollments definition not found in swagger schema. Available definitions:", Object.keys(schema.definitions || {}));
    }
  } catch (err) {
    console.error("Error fetching schema:", err);
  }
}
run();
