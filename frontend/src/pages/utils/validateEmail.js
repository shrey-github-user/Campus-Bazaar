export default function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.(ac\.in|in)$/;
  return regex.test(email);
}
