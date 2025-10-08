import { useCallback } from 'react';
import { toast } from 'sonner';

export interface SnackbarOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const useSnackbar = () => {
  const showSuccess = useCallback((message: string, options?: SnackbarOptions) => {
    toast.success(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration || 4000,
    });
  }, []);

  const showError = useCallback((message: string, options?: SnackbarOptions) => {
    toast.error(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration || 6000,
    });
  }, []);

  const showWarning = useCallback((message: string, options?: SnackbarOptions) => {
    toast.warning(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration || 5000,
    });
  }, []);

  const showInfo = useCallback((message: string, options?: SnackbarOptions) => {
    toast.info(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration || 4000,
    });
  }, []);

  const showLoading = useCallback((message: string, options?: SnackbarOptions) => {
    return toast.loading(message, {
      description: options?.description,
      duration: options?.duration || Infinity,
    });
  }, []);

  const dismiss = useCallback((toastId?: string | number) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
    dismissAll,
  };
};

export default useSnackbar;
