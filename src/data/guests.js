// Mock guests. Shape follows the brief: name, organization, ticket type, check-in code.
// Some records are deliberately incomplete to test missing-data handling.
export const guests = [
  { id: 1, name: "Amina Wanjiru", organization: "Glow Studio", ticketType: "VIP", code: "AMD-1001" },
  { id: 2, name: "Brian Otieno", organization: "Nairobi Beauty Hub", ticketType: "General", code: "AMD-1002" },
  { id: 3, name: "Cynthia Achieng", organization: "Lush Lips Co", ticketType: "Press", code: "AMD-1003" },
  { id: 4, name: "David Kamau", organization: "", ticketType: "General", code: "AMD-1004" },
  { id: 5, name: "", organization: "Velvet Cosmetics", ticketType: "VIP", code: "AMD-1005" },
  { id: 6, name: "Esther Njeri", organization: "Rose & Co", ticketType: "", code: "AMD-1006" },
  { id: 7, name: "Faith Mwangi", organization: "Pink Petal", ticketType: "General", code: "AMD-1007" },
  { id: 8, name: "George Mutua", organization: "Bloom Agency", ticketType: "Influencer", code: "AMD-1008" },
];
