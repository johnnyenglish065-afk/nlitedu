const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

const tablesToCheck = ['certificates', 'certifications', 'student_certificates', 'certificate_verifications', 'verifications', 'enrollments'];

async function run() {
  for (const table of tablesToCheck) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    if (error) {
      console.log(`Table '${table}' error:`, error.message);
    } else {
      console.log(`Table '${table}' EXISTS! Row keys:`, Object.keys(data[0] || {}));
    }
  }
}
run();
