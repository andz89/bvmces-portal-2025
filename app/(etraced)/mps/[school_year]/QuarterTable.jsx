import React from "react";
import { BiPlus, BiSolidTrash, BiEdit, BiLinkAlt } from "react-icons/bi";
import DeleteForm from "./DeleteForm.jsx";
import { exportToExcel } from "../utils/exportAsExcel.js";

const QuarterTable = ({
  mps,
  profile,
  deleteId,
  setDeleteId,
  title,
  setInitialData,
  setOpenForm,
}) => {
  return (
    <>
      <div className="mb-3 flex items-center justify-between px-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4  ">
          {title}
        </h2>

        <button
          onClick={() => exportToExcel(mps, true)}
          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>{" "}
      <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm mx-5">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              {/* <th className="px-4 py-3 text-left">Quarter</th> */}
              <th className="px-4 py-3 text-left">Grade</th>
              <th className="px-4 py-3 text-left">Section</th>
              {/* <th className="px-4 py-3 text-left">SY</th> */}

              <th className="px-4 py-3 text-center">GMRC</th>
              <th className="px-4 py-3 text-center">EPP</th>
              <th className="px-4 py-3 text-center">Filipino</th>
              <th className="px-4 py-3 text-center">English</th>
              <th className="px-4 py-3 text-center">Math</th>
              <th className="px-4 py-3 text-center">Science</th>
              <th className="px-4 py-3 text-center">AP</th>
              <th className="px-4 py-3 text-center">MAPEH</th>
              <th className="px-4 py-3 text-center">Reading</th>
              <th className="px-4 py-3 text-center">Average</th>

              <th className="px-4 py-3 text-left">LLC Source</th>

              <th className="px-4 py-3 text-left">MPS Source</th>
              {profile.role !== "visitor" && (
                <th className="px-4 py-3 text-left">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {mps?.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                {/* <td className="px-4 py-3">{item.quarter}</td> */}

                <td className="px-4 py-3">{item.class.grade}</td>

                <td className="px-4 py-3">{item.class.section}</td>

                {/* <td className="px-4 py-3">{item.school_year}</td> */}

                <td className="px-4 py-3 text-center">{item.gmrc}</td>

                <td className="px-4 py-3 text-center">{item.epp}</td>

                <td className="px-4 py-3 text-center">{item.filipino}</td>

                <td className="px-4 py-3 text-center">{item.english}</td>

                <td className="px-4 py-3 text-center">{item.math}</td>

                <td className="px-4 py-3 text-center">{item.science}</td>

                <td className="px-4 py-3 text-center">{item.ap}</td>

                <td className="px-4 py-3 text-center">{item.mapeh}</td>

                <td className="px-4 py-3 text-center">
                  {item.reading_literacy}
                </td>
                <td className="px-4 py-3 text-center">
                  {(() => {
                    const scores = [
                      item.gmrc,
                      item.epp,
                      item.filipino,
                      item.english,
                      item.math,
                      item.science,
                      item.ap,
                      item.mapeh,
                      item.reading_literacy,
                    ].filter(
                      (score) =>
                        score !== null &&
                        score !== undefined &&
                        score !== "" &&
                        score !== 0,
                    );

                    const total = scores.reduce(
                      (sum, score) => sum + Number(score),
                      0,
                    );

                    const average =
                      scores.length > 0 ? total / scores.length : 0;

                    return Number.isNaN(average)
                      ? "-"
                      : Number(average).toFixed(2);
                  })()}
                </td>

                <td className="px-4 py-3">
                  {item.llc_source ? (
                    <a
                      href={item.llc_source}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-3">
                  {item.mps_source ? (
                    <a
                      href={item.mps_source}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                {profile.role !== "visitor" && (
                  <td className="px-4 py-3  ">
                    {/* Actions */}

                    <div className="flex items-center justify-start">
                      <button
                        onClick={() => {
                          setInitialData(item);
                          setOpenForm(true);
                        }}
                        className="px-1 py-1 rounded    hover:bg-green-200 text-slate-800 text-sm   cursor-pointer"
                      >
                        <BiEdit size={20} />
                      </button>

                      {profile.role === "admin" && (
                        <>
                          {deleteId === item.id ? (
                            <DeleteForm
                              itemId={item.id}
                              onCancel={() => setDeleteId(null)}
                            />
                          ) : (
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="px-1 py-1 rounded hover:bg-red-200 text-slate-600"
                            >
                              <BiSolidTrash size={20} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default QuarterTable;
