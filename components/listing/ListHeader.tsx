"use client";

import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { Authorized } from "../auth/Authorized";

type ListHeaderProps = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  createPermission?: string;
};

export default function ListHeader({
  title,
  actionLabel,
  actionHref,
  createPermission,
}: ListHeaderProps) {
  const renderActionButton = () => {
    if (!actionLabel || !actionHref) return null;

    const button = (
      <Link href={actionHref}>
        <Button variant="primary">{actionLabel}</Button>
      </Link>
    );

    return createPermission ? (
      <Authorized permission={createPermission}>{button}</Authorized>
    ) : (
      button
    );
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h1>

      {renderActionButton()}
    </div>
  );
}
