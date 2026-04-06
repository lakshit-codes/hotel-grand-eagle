const email = 'test' + Date.now() + '@test.com';
const payload = { name: 'Test User', email: email, password: 'password123' };

console.log('Registering:', email);
let res = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: payload.name, email: payload.email, phone: '', password: payload.password })
});
const registerResText = await res.text();
console.log('Register status:', res.status, registerResText);

console.log('Logging in...');
res = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ emailOrPhone: email, password: 'password123' })
});
const loginResText = await res.text();
import fs from 'fs';
fs.writeFileSync('auth_out.json', JSON.stringify({
  register: registerResText,
  login: { status: res.status, text: loginResText }
}));
