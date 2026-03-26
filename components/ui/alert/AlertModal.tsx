"use client";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";

type AlertVariant = "info" | "success" | "danger" | "warning";

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;

  /** NEW */
  onSecondary?: () => void;
  secondaryText?: string;

  variant?: AlertVariant;
  title: string;
  message?: string;

  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
};

const VARIANT_STYLES: Record<AlertVariant, { icon: string; color: string }> = {
  info: {
    icon: "ℹ️",
    color: "text-blue-600 dark:text-blue-400",
  },
  success: {
    icon: "✅",
    color: "text-green-600 dark:text-green-400",
  },
  warning: {
    icon: "⚠️",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  danger: {
    icon: "🗑️",
    color: "text-red-600 dark:text-red-400",
  },
};

export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  onSecondary,
  secondaryText,

  variant = "info",
  title,
  message,

  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
}: AlertModalProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-md p-6"
    >
      <div className="text-center">
        <div className={`mb-4 text-4xl ${styles.color}`}>{styles.icon}</div>

        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>

        {message && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {variant === "danger" && (
              <strong className="text-gray-800 dark:text-white">
                This action cannot be undone.{" "}
              </strong>
            )}
            {message}
          </p>
        )}

        <div className="mt-6 flex justify-center gap-3">
          {showCancel && (
            <Button variant="outline" size="sm" onClick={onClose}>
              {cancelText}
            </Button>
          )}

          {onSecondary && secondaryText && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSecondary();
                onClose();
              }}
            >
              {secondaryText}
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={
              variant === "danger" ? "bg-red-500 hover:bg-red-600" : ""
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
