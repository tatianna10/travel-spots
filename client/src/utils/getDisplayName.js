export function getDisplayName(user) {
  if (!user) return "Unknown user";

  if (user.fullName && user.fullName.trim() !== "") return user.fullName;
  if (user.username && user.username.trim() !== "") return user.username;
  if (user.email) return user.email.split("@")[0];

  return "Unknown user";
}
