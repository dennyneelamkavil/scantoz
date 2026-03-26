"use client";

import Link from "next/link";
import {
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Boxes,
} from "lucide-react";
import { Authorized } from "@/components/auth/Authorized";
import Tooltip from "@/components/ui/tooltip/Tooltip";

type ListActionsProps = {
  viewHref?: string;
  editHref?: string;
  inventoryHref?: string;

  onDelete?: () => void;
  onToggle?: () => void;

  isActive?: boolean;

  editPermission?: string;
  deletePermission?: string;
  inventoryPermission?: string;

  disableDelete?: boolean;
  disableToggle?: boolean;
  disableEdit?: boolean;
};

export default function ListActions({
  viewHref,
  editHref,
  inventoryHref,

  onDelete,
  onToggle,

  isActive,

  editPermission,
  deletePermission,
  inventoryPermission,

  disableDelete = false,
  disableToggle = false,
  disableEdit = false,
}: ListActionsProps) {
  return (
    <div className="inline-flex items-center gap-3">
      {/* View */}
      {viewHref && (
        <Tooltip content="View">
          <Link
            href={viewHref}
            aria-label="View"
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <Eye size={16} />
          </Link>
        </Tooltip>
      )}

      {inventoryHref && inventoryPermission && (
        <Authorized permission={inventoryPermission}>
          <Tooltip content="Inventory">
            <Link
              href={inventoryHref}
              aria-label="Inventory"
              className="inline-flex items-center text-brand-500 hover:text-brand-600"
            >
              <Boxes size={16} />
            </Link>
          </Tooltip>
        </Authorized>
      )}

      {/* Toggle Active / Inactive */}
      {onToggle && editPermission && typeof isActive === "boolean" && (
        <Authorized permission={editPermission}>
          <Tooltip
            content={isActive ? "Deactivate" : "Activate"}
            disabled={disableToggle}
          >
            <button
              type="button"
              onClick={onToggle}
              disabled={disableToggle}
              aria-label="Toggle status"
              className={`inline-flex items-center
                ${
                  isActive
                    ? "text-green-500 hover:text-green-600"
                    : "text-gray-400 hover:text-gray-600"
                }
                disabled:cursor-not-allowed disabled:opacity-60
              `}
            >
              {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            </button>
          </Tooltip>
        </Authorized>
      )}

      {/* Edit */}
      {editHref && editPermission && (
        <Authorized permission={editPermission}>
          <Tooltip content="Edit" disabled={disableEdit}>
            {disableEdit ? (
              <span className="inline-flex items-center text-brand-500 hover:text-brand-600 cursor-not-allowed opacity-60">
                <Pencil size={16} />
              </span>
            ) : (
              <Link
                href={editHref}
                aria-label="Edit"
                className="inline-flex items-center text-brand-500 hover:text-brand-600"
              >
                <Pencil size={16} />
              </Link>
            )}
          </Tooltip>
        </Authorized>
      )}

      {/* Delete */}
      {onDelete && deletePermission && (
        <Authorized permission={deletePermission}>
          <Tooltip content="Delete" disabled={disableDelete}>
            <button
              type="button"
              onClick={onDelete}
              disabled={disableDelete}
              aria-label="Delete"
              className="inline-flex items-center text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </Authorized>
      )}
    </div>
  );
}
