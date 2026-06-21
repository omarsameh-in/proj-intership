const axios = require('axios');

async function run() {
  const baseURL = 'https://internway2.runasp.net';
  const email = `test_student_${Date.now()}@example.com`;
  const password = 'Password123!';

  console.log('1. Trying to sign up a dummy student...');
  try {
    const signupParams = new URLSearchParams({
      fullName: 'Test Student',
      email: email,
      password: password,
      confirmPassword: password,
      university: 'Test Uni',
      college: 'Test College',
      degree: 'Bachelor',
      major: 'Computer Science',
      gradYear: '2026',
      phone: '01012345678'
    }).toString();

    // Since cvFile is required, we simulate a dummy file upload
    const FormData = require('form-data');
    const form = new FormData();
    form.append('cvFile', Buffer.from('dummy pdf content'), {
      filename: 'cv.pdf',
      contentType: 'application/pdf'
    });

    const signupRes = await axios.post(`${baseURL}/Account/signUp/student?${signupParams}`, form, {
      headers: form.getHeaders()
    });
    console.log('Signup Response Status:', signupRes.status);
  } catch (err) {
    console.error('Signup Failed:', err.response ? { status: err.response.status, data: err.response.data } : err.message);
    return;
  }

  console.log('\n2. Trying to log in with the new student account...');
  let token = '';
  try {
    const loginRes = await axios.post(`${baseURL}/Account/login`, {
      email: email,
      password: password,
      userType: 'student'
    });
    console.log('Login Response Status:', loginRes.status);
    console.log('Login Response Data:', JSON.stringify(loginRes.data, null, 2));
    
    const loginData = loginRes.data?.data || loginRes.data?.Data || loginRes.data;
    token = loginData?.token || loginData?.Token || loginData?.accessToken || loginData?.AccessToken;
    console.log('Extracted Token:', token ? token.substring(0, 30) + '...' : 'NULL');
  } catch (err) {
    console.error('Login Failed:', err.response ? { status: err.response.status, data: err.response.data } : err.message);
    return;
  }

  if (!token) {
    console.log('No token obtained, stopping test.');
    return;
  }

  console.log('\n3. Trying to access /Student/Dashboard using the obtained token...');
  try {
    const dashRes = await axios.get(`${baseURL}/Student/Dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Dashboard Response Status:', dashRes.status);
    console.log('Dashboard Response Data:', JSON.stringify(dashRes.data, null, 2));
  } catch (err) {
    console.error('Dashboard Request Failed:', err.response ? { status: err.response.status, data: err.response.data } : err.message);
  }
}

run();
