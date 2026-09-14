import type { AcademicStage } from "@/types";

export const academicStages: AcademicStage[] = [
  {
    id: "classes-v-x",
    name: "Classes V–X",
    description:
      "Foundational and secondary schooling that builds core academic skills ahead of Higher Secondary.",
  },
  {
    id: "higher-secondary",
    name: "Higher Secondary",
    description:
      "Higher Secondary education at CVKM has been offered since 2000, across Science, Computer Science and Humanities streams.",
    streams: [
      {
        name: "Science",
        subjects: [
          { name: "Physics" },
          { name: "Chemistry" },
          { name: "Biology" },
          { name: "Mathematics" },
        ],
      },
      {
        name: "Computer Science",
        subjects: [
          { name: "Physics" },
          { name: "Chemistry" },
          { name: "Mathematics" },
          { name: "Computer Science" },
        ],
      },
      {
        name: "Humanities",
        subjects: [
          { name: "History" },
          { name: "Economics" },
          { name: "Political Science" },
          { name: "Sociology" },
        ],
      },
    ],
  },
];
