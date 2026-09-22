// Plain constants shared between the LLC server actions and the client
// components. Kept out of actions.js because a "use server" file may only
// export async functions.

export const SUBJECTS = [
  "gmrc",
  "epp/MTB",
  "filipino",
  "english",
  "math",
  "science",
  "ap",
  "mapeh",
  "reading",
];

export const GRADES = ["kindergarten", "1", "2", "3", "4", "5", "6"];

export const TERMS = ["1", "2", "3"];

export function gradeLabel(grade) {
  return grade === "kindergarten" ? "Kindergarten" : `Grade ${grade}`;
}
