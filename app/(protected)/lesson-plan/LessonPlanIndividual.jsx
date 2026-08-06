// "use client";
// import React from "react";
// import { BiBook, BiCalendar, BiLinkExternal, BiUser } from "react-icons/bi";
// import { deleteLessonPlan } from "./actions";
// export default function LessonPlanIndividual({ lessonPlans }) {
//   const handleDelete = async (file_id) => {
//     if (!confirm("Delete this lesson plan?")) return;

//     await deleteLessonPlan(file_id);
//   };
//   const groupedLessonPlans = [...lessonPlans]
//     .sort((a, b) => {
//       if (Number(a.term) !== Number(b.term)) {
//         return Number(a.term) - Number(b.term);
//       }

//       return Number(a.week) - Number(b.week);
//     })
//     .reduce((groups, plan) => {
//       const term = plan.term;

//       if (!groups[term]) {
//         groups[term] = [];
//       }

//       groups[term].push(plan);

//       return groups;
//     }, {});
//   return (
//     <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
//         <div>
//           <h2 className="text-lg font-semibold text-neutral-900">
//             Lesson Plans
//           </h2>

//           <p className="text-sm text-neutral-500 mt-1">Uploaded lesson plans</p>
//         </div>

//         <div className="rounded-lg border border-neutral-200 bg-white px-4 py-2">
//           <p className="text-xs uppercase tracking-wide text-neutral-500">
//             Total
//           </p>

//           <p className="text-xl font-bold text-neutral-900">
//             {lessonPlans.length}
//           </p>
//         </div>
//       </div>

//       {lessonPlans.length === 0 ? (
//         <div className="py-16 text-center">
//           <BiBook className="mx-auto text-5xl text-neutral-300" />

//           <h3 className="mt-4 text-lg font-semibold text-neutral-700">
//             No lesson plans found
//           </h3>

//           <p className="mt-1 text-sm text-neutral-500">
//             Upload your first lesson plan.
//           </p>
//         </div>
//       ) : (
//         <div>
//           {Object.entries(groupedLessonPlans).map(([term, plans]) => (
//             <div key={term} className="mb-8">
//               <div className="bg-emerald-500 text-white px-6 py-3 font-bold text-lg  ">
//                 Term {term}
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full  ">
//                   <thead className="text-left   border-b  ">
//                     <tr className="text-sm  font-semibold  text-slate-700">
//                       <th className="px-6 py-3">Teacher</th>
//                       <th className="px-6 py-3">Grade</th>
//                       <th className="px-6 py-3 ">Week</th>
//                       <th className="px-6 py-3   ">term</th>
//                       <th className="px-6 py-3 text-center">Subject==</th>

//                       <th className="px-6 py-3 text-center">Submitted </th>

//                       <th className="px-6 py-3 text-center">Action</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {plans.map((plan) => (
//                       <tr
//                         key={plan.file_id}
//                         className="border-b border-neutral-100 hover:bg-neutral-50 transition "
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
//                               <BiUser className="text-emerald-600 text-lg" />
//                             </div>

//                             <span className="font-medium text-neutral-800 uppercase text-sm">
//                               {plan.teacherName}
//                             </span>
//                           </div>
//                         </td>

//                         <td className="px-6 py-4 uppercase text-sm">
//                           {plan.grade}
//                         </td>

//                         <td className="px-6 py-4  ">
//                           <span className="inline-flex w-15 items-center gap-1 rounded-full   py-1 text-sm font-medium text-emerald-700">
//                             W - {plan.week}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4">
//                           <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
//                             {plan.term}
//                           </span>
//                         </td>

//                         <td className="  py-4 w-full     text-center">
//                           <span className="items-center gap-1 rounded-full   text-sm font-medium text-emerald-700 ">
//                             {plan.subject}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
//                             {(() => {
//                               const formatted = new Date(
//                                 plan.Timestamp,
//                               ).toLocaleDateString("en-US");
//                               return formatted;
//                             })()}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4 text-center">
//                           <a
//                             href={plan.FileLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
//                           >
//                             <BiLinkExternal />
//                             Open
//                           </a>
//                         </td>

//                         <td className="px-6 py-4 text-center">
//                           <button
//                             onClick={() => handleDelete(plan.file_id)}
//                             className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
//                           >
//                             Remove
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
