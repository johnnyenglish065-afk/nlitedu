const fs = require('fs');
const envStr = fs.readFileSync('.env.local', 'utf8');
const env = {};
envStr.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) env[parts[0]] = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
});

const appId = env.CASHFREE_APP_ID;
const secretKey = env.CASHFREE_SECRET_KEY;

async function testCF() {
  const res = await fetch('https://api.cashfree.com/pg/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-version': '2023-08-01', 'x-client-id': appId, 'x-client-secret': secretKey },
    body: JSON.stringify({
      order_amount: 1, order_currency: 'INR', order_id: 'test_123',
      customer_details: { customer_id: 'test_cust', customer_email: 'test@example.com', customer_phone: '9999999999' }
    })
  });
  console.log('Production response:', await res.text());

  const res2 = await fetch('https://sandbox.cashfree.com/pg/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-version': '2023-08-01', 'x-client-id': appId, 'x-client-secret': secretKey },
    body: JSON.stringify({
      order_amount: 1, order_currency: 'INR', order_id: 'test_123',
      customer_details: { customer_id: 'test_cust', customer_email: 'test@example.com', customer_phone: '9999999999' }
    })
  });
  console.log('Sandbox response:', await res2.text());
}
testCF();
