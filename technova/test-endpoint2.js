import https from 'https';

const data = JSON.stringify({
  name: "Test",
  email: "test@example.com",
  requirement: "Testing backend form"
});

const options = {
  hostname: 'technova-1-hmjx.onrender.com',
  port: 443,
  path: '/api/v1/leads',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log("RESPONSE:", body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
