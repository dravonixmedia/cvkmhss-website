import type { FaqCategory } from "@/types";

/**
 * FAQ answers must only restate verified facts already present elsewhere in
 * this data layer (see site.ts, academics.ts, campus.ts). Do not add claims
 * — admission dates, fees, results — that are not independently verified.
 */
export const faqCategories: FaqCategory[] = [
  {
    id: "school",
    name: "School",
    items: [
      {
        question: "What is C V K M Higher Secondary School?",
        answer:
          "C V K M Higher Secondary School (CVKM HSS) is an educational institution in East Kallada, Kollam, Kerala, India, established in 1926.",
      },
      {
        question: "Where is CVKM Higher Secondary School located?",
        answer:
          "CVKM HSS is located in East Kallada, Kollam district, Kerala, India.",
      },
      {
        question: "When was CVKM HSS established?",
        answer:
          "CVKM HSS was established in 1926. Its Higher Secondary section began in 2000.",
      },
    ],
  },
  {
    id: "academics",
    name: "Academics",
    items: [
      {
        question: "What classes are available at CVKM HSS?",
        answer:
          "CVKM HSS offers Classes V–X as well as Higher Secondary (Classes XI–XII).",
      },
      {
        question: "Which Higher Secondary streams are available at CVKM?",
        answer:
          "CVKM HSS offers three Higher Secondary streams: Science, Computer Science, and Humanities.",
      },
    ],
  },
  {
    id: "facilities",
    name: "Facilities",
    items: [
      {
        question: "What facilities are available at CVKM HSS?",
        answer:
          "CVKM HSS offers Smart Classrooms, a Library, a Science Laboratory, a Computer Laboratory, an Auditorium, a Playground, and School Transportation across its 4-acre campus.",
      },
    ],
  },
  {
    id: "admissions",
    name: "Admissions",
    items: [
      {
        question: "How can I enquire about admission?",
        answer:
          "You can enquire about admission by contacting the school office directly through the Contact page. Detailed admission guidelines will be published on the Admissions page.",
      },
    ],
  },
];
