const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

async function run() {
  try {
    const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`;
    const res = await fetch(url);
    const json = await res.json();
    console.log("Keys in OpenAPI definitions:", Object.keys(json.definitions || {}));
    if (json.definitions?.certificates) {
      console.log(JSON.stringify(json.definitions.certificates, null, 2));
    }
  } catch (err) {
    console.error("Error fetching OpenAPI schema:", err);
  }
}
run();
