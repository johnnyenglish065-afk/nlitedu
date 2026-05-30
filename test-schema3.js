const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://othxceezbpfiauaevibt.supabase.co';
const supabaseKey = 'sb_publishable_ki8a43mdYzPTaypjvfBNFw_caZ1fTyv';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('enrollments')
    .select('paid_amount, original_price, amount, price, fee')
    .limit(1);
  console.log("Data:", data);
  if (error) console.log("Error:", error);
}

run();
