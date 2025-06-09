export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

export async function getClientInfo() {
  return {
    userAgent: navigator.userAgent,
  };
}

export function showToast(message, type) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white text-sm transition-opacity duration-300 opacity-100 ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`;
    setTimeout(() => {
      toast.className = 'fixed bottom-4 right-4 hidden p-4 rounded-lg shadow-lg text-white text-sm transition-opacity duration-300 opacity-0';
    }, 3000);
  }
}

export async function generateIdentifier(ip, userAgent) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + userAgent);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}