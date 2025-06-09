export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function getClientInfo() {
  const userAgent = navigator.userAgent;
  return { userAgent };
}

export function showToast(message, type = 'info') {
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
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(ip + userAgent)
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}