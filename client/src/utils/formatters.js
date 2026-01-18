export function getDisplayName(user) {
  if (!user) return "Unknown user";
  if (user.fullName && user.fullName.trim() !== "") return user.fullName;
  if (user.email && user.email.includes("@")) return user.email.split("@")[0];

  return "Unknown user";
}


export function formatRelativeTime(timestamp) {
  if (!timestamp) return '';

  const ms =
    typeof timestamp === 'string'
      ? new Date(timestamp).getTime()
      : timestamp;

  if (!Number.isFinite(ms)) return '';

  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (min < 1) return 'just now';
  if (min < 60) return `${min} minute${min !== 1 ? 's' : ''} ago`;
  if (hr < 24) return `${hr} hour${hr !== 1 ? 's' : ''} ago`;
  return `${day} day${day !== 1 ? 's' : ''} ago`;
}
