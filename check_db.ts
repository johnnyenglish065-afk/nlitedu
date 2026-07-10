import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log("Supabase URL:", url);

const supabase = createClient(url, key);

async function check() {
  console.log("Checking enrollments...");
  const { data: enrollments, error: err } = await supabase
    .from("enrollments")
    .select("*")
    .limit(50);

  if (err) {
    console.error("Error reading enrollments:", err);
  } else {
    console.log("Enrollments count:", enrollments?.length);
    console.log("Statuses in database:", [...new Set(enrollments?.map(e => e.status))]);
    const paid = enrollments?.filter(e => e.status?.toUpperCase() === "PAID") || [];
    console.log("Paid count:", paid.length);
    if (paid.length > 0) {
      console.log("Paid enrollment sample:", paid[0]);
    } else {
      console.log("All enrollments:", enrollments?.map(e => ({ id: e.id, name: e.full_name, status: e.status })));
    }
  }

  console.log("\nChecking certificates...");
  const { data: certs, error: certErr } = await supabase
    .from("certificates")
    .select("*")
    .limit(10);

  if (certErr) {
    console.error("Error reading certificates:", certErr);
  } else {
    console.log("Certificates count:", certs?.length);
    console.log("Sample certificate:", certs?.[0]);
  }
}

check();
