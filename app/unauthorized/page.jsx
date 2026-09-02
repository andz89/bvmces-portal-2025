import Link from "next/link";
import { FiShieldOff, FiArrowLeft } from "react-icons/fi";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-lis-primary flex items-center justify-center p-6">
      <div className="relative overflow-hidden bg-white/80  border border-white/30  rounded-sm max-w-lg w-full p-10 text-center">
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-lis-panel-header rounded-full  opacity-40"></div>
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-lis-panel-header rounded-full  opacity-40"></div>

        {/* Icon */}
        <div className="relative z-10 flex justify-center mb-6">
          <div className="w-20 h-20 rounded-sm bg-lis-danger-bg flex items-center justify-center shadow-inner">
            <FiShieldOff className="text-lis-danger-text text-4xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="relative z-10 text-4xl font-bold text-lis-text mb-3 tracking-tight">
          Access Denied
        </h1>

        {/* Description */}
        <p className="relative z-10 text-lis-muted leading-relaxed mb-8 text-base">
          Sorry, you do not have permission to access this page. Please contact
          the administrator if you believe this is a mistake.
        </p>

        {/* Footer */}
        <p className="relative z-10 mt-8 text-xs text-lis-muted">
          Error Code: 403 Unauthorized
        </p>
      </div>
    </div>
  );
}
