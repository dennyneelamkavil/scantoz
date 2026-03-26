"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import AlertModal from "@/components/ui/alert/AlertModal";
import {
  ListActions,
  ListError,
  ListFilters,
  ListHeader,
} from "@/components/listing";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { SortableTableHeader } from "@/components/common/SortableTableHeader";

import { useAdminTable } from "@/hooks";

import type { Role } from "@/lib/types";
import { deleteAction } from "@/lib/actions";

type RoleSortKey = "name" | "isSuperAdmin" | "createdAt";

export default function RolesListClient() {
  const { data: session } = useSession();
  const currentUserRoleId = session?.user?.role?.id;

  const [item, setItem] = useState<Role | null>(null);

  const {
    data: roles,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<Role, RoleSortKey>({
    endpoint: "roles",
    storageKey: "table:roles",
    defaultSort: { key: "createdAt", direction: "desc" },
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/roles/${item.id}`, {
      successMessage: "Role deleted successfully",
      errorMessage: "Failed to delete role",
    });

    if (success) refetch();
    setItem(null);
  }

  return (
    <div className="space-y-6">
      <ListHeader
        title="Roles"
        actionLabel="Create Role"
        actionHref="/roles/create"
        createPermission="role:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={() => {
          setSearch("");
          setPage(1);
        }}
        disableClear={!search}
      />

      <div className="rounded-lg border bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full table-auto">
          <thead className="border-b dark:border-gray-800">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                <SortableTableHeader<RoleSortKey>
                  columnKey="name"
                  label="Name"
                  activeKey={sortState.key}
                  direction={sortState.direction}
                  onSort={onSortChange}
                />
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                <SortableTableHeader<RoleSortKey>
                  columnKey="isSuperAdmin"
                  label="Super Admin"
                  activeKey={sortState.key}
                  direction={sortState.direction}
                  onSort={onSortChange}
                />
              </th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                <SortableTableHeader<RoleSortKey>
                  columnKey="createdAt"
                  label="Created"
                  activeKey={sortState.key}
                  direction={sortState.direction}
                  onSort={onSortChange}
                />
              </th>
              <th className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton columns={4} />
            ) : error ? (
              <ListError error={error} columns={4} />
            ) : roles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                >
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="border-b dark:border-gray-800">
                  <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                    {role.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                    {role.isSuperAdmin ? "Yes" : "No"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ListActions
                      viewHref={`/roles/${role.id}`}
                      editHref={`/roles/${role.id}/edit`}
                      onDelete={() => setItem(role)}
                      editPermission="role:update"
                      deletePermission="role:delete"
                      disableEdit={role.id === currentUserRoleId}
                      disableDelete={role.id === currentUserRoleId}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-end p-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <AlertModal
        isOpen={!!item?.id}
        variant="danger"
        title={`Delete Role: ${item?.name}?`}
        message="This will permanently remove this role if it is not in use."
        confirmText="Delete"
        onClose={() => setItem(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
