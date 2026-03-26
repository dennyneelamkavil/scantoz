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
import { Select } from "@/components/form";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { SortableTableHeader } from "@/components/common/SortableTableHeader";

import { useAdminAll, useAdminTable } from "@/hooks";

import type { User, RoleBase } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

type UserSortKey = "username" | "fullname" | "isActive" | "createdAt";

export default function UsersListClient() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [item, setItem] = useState<User | null>(null);
  const [toggleItem, setToggleItem] = useState<User | null>(null);
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("true");

  const {
    data: users,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<User, UserSortKey>({
    endpoint: "users",
    storageKey: "table:users",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      roleId: role,
      isActive,
    }),
  });
  const { data: roles } = useAdminAll<RoleBase>({
    endpoint: "roles",
  });

  async function confirmDelete() {
    if (!item || item.id === currentUserId) return;

    const success = await deleteAction(`/api/admin/users/${item.id}`, {
      successMessage: "User deleted successfully",
      errorMessage: "Failed to delete user",
    });

    if (success) refetch();
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem || toggleItem.id === currentUserId) return;

    const success = await toggleAction(
      `/api/admin/users/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "User status updated",
        errorMessage: "Failed to update user status",
      }
    );

    if (success) refetch();
    setToggleItem(null);
  }

  function clearFilters() {
    setSearch("");
    setRole("");
    setIsActive("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListHeader
        title="Users"
        actionLabel="Create User"
        actionHref="/users/create"
        createPermission="user:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={clearFilters}
        disableClear={!search && !role && !isActive}
      >
        {/* Role filter */}
        <div className="w-full sm:max-w-xs">
          <Select
            options={roles.map((r) => ({
              value: r.id,
              label: r.name,
            }))}
            value={role}
            placeholder="Select a role"
            onChange={(value) => {
              setPage(1);
              setRole(value);
            }}
          />
        </div>

        <div className="w-full sm:max-w-xs">
          <Select
            options={[
              { value: "", label: "All" },
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            value={isActive}
            placeholder="Select status"
            onChange={(value) => {
              setPage(1);
              setIsActive(value);
            }}
          />
        </div>
      </ListFilters>

      {/* Card */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<UserSortKey>
                    columnKey="username"
                    label="Username"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<UserSortKey>
                    columnKey="fullname"
                    label="Name"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<UserSortKey>
                    columnKey="isActive"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<UserSortKey>
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
                <TableSkeleton columns={6} />
              ) : error ? (
                <ListError error={error} columns={6} />
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {user.username}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {user.fullname}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {user.role?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {user.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/users/${user.id}`}
                        onToggle={() => setToggleItem(user)}
                        editHref={`/users/${user.id}/edit`}
                        isActive={user.isActive}
                        onDelete={() => setItem(user)}
                        editPermission="user:update"
                        deletePermission="user:delete"
                        disableToggle={user.id === currentUserId}
                        disableDelete={user.id === currentUserId}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
        title={`Delete User: ${item?.fullname}?`}
        message="If you only want to block access, mark the user as inactive instead."
        confirmText="Delete"
        onClose={() => setItem(null)}
        onConfirm={confirmDelete}
        secondaryText="Deactivate Instead"
        onSecondary={() => {
          setToggleItem(item);
          setItem(null);
        }}
      />
      <AlertModal
        isOpen={!!toggleItem}
        variant="warning"
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} User: ${
          toggleItem?.fullname
        }?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this user.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
