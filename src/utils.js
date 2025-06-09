export function formatNumber(num) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toString();
}

export function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export async function getClientInfo() {
  const userAgent = navigator.userAgent;
  return { userAgent };
}

export async function generateIdentifier(ip, userAgent) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + userAgent);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function showToast(message, type = 'error') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white text-sm transition-opacity duration-300 opacity-100 ${
    type === 'error' ? 'bg-red-500' : 'bg-green-500'
  }`;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 3000);
}