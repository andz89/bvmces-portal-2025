import { BiCheckCircle } from "react-icons/bi";

export default function SuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  p-4">
      <div className="w-full max-w-md overflow-hidden rounded-sm bg-white ">
        {/* Header */}
        <div className="bg-lis-success px-8 py-5 text-center">
          <h2 className="text-2xl font-bold text-white">
            Submission Successful
          </h2>

          <p className="mt-1 text-white/80">
            Your lesson plan has been submitted.
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center px-8 py-10">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-lis-panel-header">
            <BiCheckCircle size={90} className="text-lis-success-text" />
          </div>

          <h3 className="mt-6 text-xl font-bold text-lis-text">
            Upload Complete!
          </h3>

          <p className="mt-3 text-center text-lis-muted">
            Your lesson plan has been successfully submitted.
            <br />
            <br />
            Note: If the newly submitted lesson plan is not displayed in the
            list, please refresh the page.
          </p>

          <button
            onClick={onClose}
            className="mt-8 rounded-sm bg-lis-success px-8 py-3 font-semibold text-white transition hover:bg-lis-success-hover"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
