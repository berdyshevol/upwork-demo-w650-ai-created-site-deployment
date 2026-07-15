export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faq: FaqItem[] = [
  {
    id: "faq-deposit",
    question: "How much is the deposit and is it refundable?",
    answer:
      "A $100 deposit holds your date and comes off the final price of the tattoo. It is refundable up to 72 hours before the appointment; inside 72 hours it covers the drawing time and the empty chair, so it stays with the studio.",
  },
  {
    id: "faq-consultation",
    question: "Do I need a consultation before booking?",
    answer:
      "Not for flash or anything under a palm. For custom pieces, send the booking form first — the studio reads your request, matches an artist, and replies with either a date or a 20-minute chat if the idea needs narrowing down.",
  },
  {
    id: "faq-pricing",
    question: "How is the price worked out?",
    answer:
      "Hourly, at $140, with a one-hour minimum. Your request form gives us an estimate in sessions; the artist confirms the real number once the drawing is done, and we tell you before any needle touches skin.",
  },
  {
    id: "faq-age",
    question: "What is the minimum age?",
    answer:
      "18, with photo ID at the door, no exceptions and no parental consent workaround. If the ID does not match the booking name we cannot tattoo you.",
  },
  {
    id: "faq-coverup",
    question: "Can you cover an existing tattoo?",
    answer:
      "Usually. Dex handles cover-ups and needs a well-lit photo of the current piece, taken straight on. Dark, heavy work limits the options, so expect the new design to be larger than the old one.",
  },
  {
    id: "faq-aftercare",
    question: "What does aftercare look like?",
    answer:
      "Keep the wrap on for 4 hours, wash with unscented soap twice a day, and use a thin layer of ointment for the first week. No pools, no gym, no direct sun for two weeks. Peeling is normal; picking is not.",
  },
  {
    id: "faq-reschedule",
    question: "Can I move my appointment?",
    answer:
      "Once, free, with at least 72 hours notice. Later than that, or a second move, and we ask for a fresh hold to cover the lost slot.",
  },
  {
    id: "faq-touchup",
    question: "Are touch-ups included?",
    answer:
      "One free touch-up within 90 days on anything the studio tattooed, as long as you followed aftercare. Hands, feet and fingers fade faster and are the exception — those are charged at the hourly rate.",
  },
];
