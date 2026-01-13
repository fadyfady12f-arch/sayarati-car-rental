import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage = ({
  message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  onRetry
}: ErrorMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        عذراً!
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
