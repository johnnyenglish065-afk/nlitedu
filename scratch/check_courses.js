const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('courses')
    .select('*');
  
  if (error) {
    console.error("Error querying courses:", error);
  } else {
    console.log(`Successfully fetched ${data.length} courses!`);
    if (data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
      console.log("First course details:");
      console.log(JSON.stringify(data[0], null, 2));
      
      console.log("\nList of all courses (id, title, slug, program_type, price):");
      data.forEach(c => {
        console.log(`- ID: ${c.id} | Slug: ${c.slug} | Title: ${c.title} | Program: ${c.program_type} | Govt: ${c.govt_price} | Pvt: ${c.pvt_price}`);
      });
    } else {
      console.log("No courses found in database.");
    }
  }
}
run();
