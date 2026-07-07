const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local file not found at", envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase keys not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding sample certificate...");
  
  const sampleCert = {
    certificate_number: 'NLIT-2026-100249',
    student_name: 'Aarav Sharma',
    course_name: 'Advanced Web Development & Cloud Computing',
    college_name: 'NLIT Delhi Campus',
    grade: 'A+',
    duration: '6 Weeks Training & Internship',
    issue_date: '2026-07-07'
  };

  const { data, error } = await supabase
    .from('certificates')
    .insert([sampleCert])
    .select();

  if (error) {
    if (error.code === '42P01') {
      console.error("\n❌ ERROR: Table 'certificates' does not exist in your Supabase database.");
      console.error("Please run the SQL migration query inside 'supabase/create_certificates_table.sql' first using the Supabase Dashboard SQL Editor.");
    } else if (error.code === '23505') {
      console.log("\n✨ Notice: Certificate number 'NLIT-2026-100249' is already seeded!");
    } else {
      console.error("\n❌ Error seeding certificate:", error.message);
    }
  } else {
    console.log("\n✅ Success! Seeded sample certificate:", data[0]);
  }
}

seed();
