const testAPI = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test1234@technova.com', password: 'password123' })
    });
    const data = await res.json();
    console.log('Register Response:', data);

    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test1234@technova.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
  } catch (err) {
    console.error(err);
  }
};

testAPI();
