// Utility to extract error message from axios or fetch errors
export default function getErrorMessage(error) {
  if (!error) return 'Unknown error';
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) return error.message;
  return 'An error occurred';
}
