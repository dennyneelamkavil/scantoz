"use client";

import Button from "@/components/ui/button/Button";
import { Authorized } from "@/components/auth/Authorized";

type ViewActionsProps = {
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  primaryType?: "submit" | "button";
  primaryPermission?: string;

  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryType?: "submit" | "button";
  secondaryPermission?: string;

  backLabel?: string;
  onBack?: () => void;
};

export default function ViewActions({
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryType = "submit",
  primaryPermission,

  secondaryLabel,
  onSecondary,
  secondaryType = "button",
  secondaryPermission,

  backLabel = "Back",
  onBack,
}: ViewActionsProps) {
  return (
    <div className="flex gap-3 pt-6 border-t dark:border-gray-800">
      {primaryLabel && primaryPermission && (
        <Authorized permission={primaryPermission}>
          <Button
            type={primaryType}
            disabled={primaryDisabled}
            onClick={onPrimary}
          >
            {primaryLabel}
          </Button>
        </Authorized>
      )}

      {secondaryLabel && onSecondary && secondaryPermission && (
        <Authorized permission={secondaryPermission}>
          <Button variant="outline" type={secondaryType} onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        </Authorized>
      )}

      {onBack && (
        <Button variant="outline" type="button" onClick={onBack}>
          {backLabel}
        </Button>
      )}
    </div>
  );
}
