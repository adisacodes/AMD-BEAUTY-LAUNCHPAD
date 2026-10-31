// The three launch-poll questions. Votes are stored by option label.
export const polls = [
  {
    id: "q1",
    text: "Which shade is your favourite?",
    options: [
      { label: "Rasberry", hint: "Warm nude", swatch: "linear-gradient(135deg,#dba086,#a85b43)" },
      { label: "Toast", hint: "Rich berry", swatch: "linear-gradient(135deg,#c2185b,#5e0f35)" },
      { label: "Ribbon", hint: "Soft pink", swatch: "linear-gradient(135deg,#fadbe3,#e99db1)" },
    ],
  },
  {
    id: "q2",
    text: "What matters most in a lip product?",
    options: [
      { label: "Long-lasting", hint: "Stays fresh all day", icon: "clock" },
      { label: "Moisturizing", hint: "Keeps lips soft", icon: "drop" },
      { label: "Colour payoff", hint: "Rich and vibrant colour", icon: "sparkle" },
    ],
  },
  {
    id: "q3",
    text: "How likely are you to buy it?",
    options: [
      { label: "Definitely", hint: "I'm getting it", icon: "heart" },
      { label: "Probably", hint: "Most likely", icon: "thumb" },
      { label: "Not sure", hint: "Need more info", icon: "question" },
    ],
  },
];
