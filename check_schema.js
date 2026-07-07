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

async function run() {
  console.log("Checking columns of certificates...");
  const { data, error } = await supabase.rpc('get_columns', { table_name: 'certificates' });
  if (error) {
    // If RPC doesn't exist, try querying a non-existent row and check what error/info we can get, or query via REST API postgres schema if accessible
    console.log("RPC get_columns failed/not found, trying alternative...");
    
    // We can query a dummy select to get metadata or inspect
    const { data: certData, error: certError } = await supabase.from('certificates').select('*').limit(1);
    console.log("certificates query status:", certError || "Success");
    
    // Let's try to query information_schema via RPC if possible
    const { data: infoData, error: infoError } = await supabase
      .from('certificates')
      .insert({ certificate_number: 'TEMP_TEST_PROBE_123', student_name: 'test', course_name: 'test' })
      .select();
    
    console.log("Insert response:", infoData, infoError);
  } else {
    console.log("Columns:", data);
  }
}
run();
