"use client";
import { BiPlus, BiSolidTrash, BiEdit, BiLinkAlt } from "react-icons/bi";
import { deleteGPA } from "./actions";
import { useState } from "react";
import toast from "react-hot-toast";
import FullPageLoader from "../../../components/loader/FullPageLoader";

const GPATable = ({
  section,
  schoolYear,
  grade,
  data,
  profile,
  setDeleteId,
  deleteId,
  quarter,
  setOpenEdit,
  setInitialData,
  class_id,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(`Delete all GPA rows for section?`);

    if (!confirmed) return;
    setLoading(true);
    try {
      const result = await deleteGPA({
        class_id,
        quarter,
        school_year: schoolYear,
      });

      if (result.success) {
        setLoading(false);

        toast.success(result.message);
      } else {
        setLoading(false);

        toast.error(result.message);
      }
    } catch (error) {
      setLoading(false);

      toast.error("Something went wrong.");
    }
  };
  return (
    <div className="mb-10 ">
      {loading && <FullPageLoader />}

      <div className="flex justify-between mx-5">
        <div className="px-2 mb-4">
          <h2 className="text-lg font-medium text-slate-800">
            Quarter {quarter.toUpperCase()} / Grade {grade}{" "}
            {section.toUpperCase()}
          </h2>
        </div>
        <div>
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-red-400 hover:bg-red-500 text-white cursor-pointer font-md"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mx-5 border border-slate-300 rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th rowSpan="2" className="border border-slate-500 px-4 py-3">
                SUBJECTS
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                FAILED
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                FAIRLY SATISFACTORY
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                SATISFACTORY
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                VERY SATISFACTORY
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                EXCELLENT
              </th>
              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                <div>Actions</div>
              </th>
            </tr>

            <tr className="bg-slate-900 text-white">
              {/* FAILED */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* FS */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* SATISFACTORY */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* VS */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* EXCELLENT */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* action */}
              <th className="border border-slate-500 px-3 py-2"></th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="text-center hover:bg-slate-50">
                <td className="border border-slate-400 px-4 py-3 font-medium text-left">
                  {item.subject.toUpperCase()}
                </td>

                {/* FAILED */}
                <td className="border border-slate-400">
                  {item.not_meet_male}
                </td>

                <td className="border border-slate-400">
                  {item.not_meet_female}
                </td>

                <td className="border border-slate-400 font-semibold">
                  {Number(item.not_meet_male) + Number(item.not_meet_female)}
                </td>

                {/* FS */}
                <td className="border border-slate-400">{item.fs_male}</td>

                <td className="border border-slate-400">{item.fs_female}</td>

                <td className="border border-slate-400 font-semibold">
                  {Number(item.fs_male) + Number(item.fs_female)}
                </td>

                {/* SATISFACTORY */}
                <td className="border border-slate-400">{item.s_male}</td>

                <td className="border border-slate-400">{item.s_female}</td>

                <td className="border border-slate-400 font-semibold">
                  {Number(item.s_male) + Number(item.s_female)}
                </td>

                {/* VS */}
                <td className="border border-slate-400">{item.vs_male}</td>

                <td className="border border-slate-400">{item.vs_female}</td>

                <td className="border border-slate-400 font-semibold">
                  {Number(item.vs_male) + Number(item.vs_female)}
                </td>

                {/* EXCELLENT */}
                <td className="border border-slate-400">{item.e_male}</td>

                <td className="border border-slate-400">{item.e_female}</td>

                <td className="border border-slate-400 font-semibold">
                  {Number(item.e_male) + Number(item.e_female)}
                </td>
                <td className="border border-slate-400 font-semibold mx-auto ">
                  {profile.role !== "visitor" && (
                    <>
                      {/* Actions */}

                      <div className="flex items-center justify-center   w-full  ">
                        <button
                          onClick={() => {
                            setInitialData(item);
                            setOpenEdit(true);
                          }}
                          className="px-1 py-1 rounded    hover:bg-green-200 text-slate-800 text-sm   cursor-pointer"
                        >
                          <BiEdit size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GPATable;
