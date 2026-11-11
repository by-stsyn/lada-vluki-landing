import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="sticky top-0 z-10 bg-[#26303a] text-white px-6 py-5 rounded-t-2xl border-b border-white/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#ff6700] shrink-0" />
              <h2 className="text-xl font-extrabold leading-snug">{title}</h2>
            </div>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={onClose}
              className="bg-white/10 hover:bg-[#ff6700] rounded-lg p-2 transition shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
