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
  const { data, error } = await supabase.from('courses').select('title, slug, program_type, price, govt_price, pvt_price, job_price');
  if (error) {
    console.error("Error fetching courses:", error);
  } else {
    console.log("All courses:");
    data.forEach(c => {
      console.log(`- Title: "${c.title}" | Slug: "${c.slug}" | ProgramType: "${c.program_type}" | PriceLabel: "${c.price}" | Prices: [Govt: ${c.govt_price}, Pvt: ${c.pvt_price}, Job: ${c.job_price}]`);
    });
  }
}
run();
