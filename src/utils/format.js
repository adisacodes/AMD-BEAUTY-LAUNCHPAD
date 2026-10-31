// Fallbacks so a blank field never breaks the screen.
export function displayName(guest) {
  return guest?.name?.trim() || "Unnamed guest";
}
export function displayOrg(guest) {
  return guest?.organization?.trim() || "No organization";
}
export function displayTicket(guest) {
  return guest?.ticketType?.trim() || "No ticket type";
}
export function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
