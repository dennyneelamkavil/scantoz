"use client";

import { useState } from "react";

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

import { useAdminTable } from "@/hooks";
import { deleteAction, toggleAction } from "@/lib/actions";

import type { Customer } from "@/lib/types";

type CustomerSortKey = "fullName" | "isActive" | "createdAt";

export default function CustomersListClient() {
  const [item, setItem] = useState<Customer | null>(null);
  const [toggleItem, setToggleItem] = useState<Customer | null>(null);
  const [isActive, setIsActive] = useState("true");

  const {
    data: customers,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<Customer, CustomerSortKey>({
    endpoint: "customers",
    storageKey: "table:customers",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      isActive,
    }),
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/customers/${item.id}`, {
      successMessage: "Customer deleted successfully",
      errorMessage: "Failed to delete customer",
    });

    if (success) refetch();
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/customers/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "Customer status updated",
        errorMessage: "Failed to update customer status",
      },
    );

    if (success) refetch();
    setToggleItem(null);
  }

  function clearFilters() {
    setSearch("");
    setIsActive("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <ListHeader
        title="Customers"
        actionLabel="Create Customer"
        actionHref="/customers/create"
        createPermission="customer:create"
      />
      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={clearFilters}
        disableClear={!search && !isActive}
      >
        <div className="w-full sm:max-w-xs">
          <Select
            options={[
              { value: "", label: "All" },
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            value={isActive}
            placeholder="Status"
            onChange={(value) => {
              setPage(1);
              setIsActive(value);
            }}
          />
        </div>
      </ListFilters>
      <div className="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CustomerSortKey>
                    columnKey="fullName"
                    label="Name"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Wishlist
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CustomerSortKey>
                    columnKey="isActive"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CustomerSortKey>
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
                <TableSkeleton columns={7} />
              ) : error ? (
                <ListError error={error} columns={7} />
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {customer.fullName ?? "-"}
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {customer.phone}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {customer.email ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {customer.wishlist?.length ?? 0}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {customer.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/customers/${customer.id}`}
                        editHref={`/customers/${customer.id}/edit`}
                        onToggle={() => setToggleItem(customer)}
                        isActive={customer.isActive}
                        onDelete={() => setItem(customer)}
                        editPermission="customer:update"
                        deletePermission="customer:delete"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
        isOpen={!!item}
        variant="danger"
        title={`Delete Customer: ${item?.phone}?`}
        message="If you just want to block the customer, consider deactivating the customer"
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
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} Customer: ${toggleItem?.fullName}?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this customer.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
