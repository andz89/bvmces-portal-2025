import { BiCheckCircle } from "react-icons/bi";

export default function SuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-emerald-600 px-8 py-5 text-center">
          <h2 className="text-2xl font-bold text-white">
            Submission Successful
          </h2>

          <p className="mt-1 text-emerald-100">
            Your lesson plan has been submitted.
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center px-8 py-10">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-100">
            <BiCheckCircle size={90} className="text-emerald-600" />
          </div>

          <h3 className="mt-6 text-xl font-bold text-slate-800">
            Upload Complete!
          </h3>

          <p className="mt-3 text-center text-slate-500">
            Your lesson plan has been successfully submitted.
            <br />
            <br />
            Note: If the newly submitted lesson plan is not displayed in the
            list, please refresh the page.
          </p>

          <button
            onClick={onClose}
            className="mt-8 rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
