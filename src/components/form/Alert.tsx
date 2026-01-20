"use client";

interface AlertData {
  type: "success" | "error" | "";
  message: string;
  visible: boolean;
}

interface AlertProps {
  alert: AlertData;
  onClose: () => void;
}

export default function Alert({ alert, onClose }: AlertProps) {
  if (!alert.visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-slide-in">
      <div
        className={`rounded-lg border shadow-xl px-5 py-4 ${
          alert.type === "success"
            ? "bg-green-600 border-green-700"
            : "bg-red-600 border-red-700"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-semibold text-sm text-white">
              {alert.type === "success" ? "Success" : "Error"}
            </p>
            <p className="mt-1 text-sm text-white">{alert.message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none opacity-80 hover:opacity-100 transition-opacity text-white"
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
