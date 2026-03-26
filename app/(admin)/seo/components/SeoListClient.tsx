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

import type { PageSeo } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

type PageSeoSortKey = "pageKey" | "isActive" | "createdAt";

export default function SeoListClient() {
  const [item, setItem] = useState<PageSeo | null>(null);
  const [toggleItem, setToggleItem] = useState<PageSeo | null>(null);
  const [isActive, setIsActive] = useState("true");

  const {
    data: pageSeos,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<PageSeo, PageSeoSortKey>({
    endpoint: "seo",
    storageKey: "table:seo",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      isActive,
    }),
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/seo/${item.id}`, {
      successMessage: "Page SEO deleted successfully",
      errorMessage: "Failed to delete Page SEO",
    });

    if (success) refetch();
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/seo/${toggleItem.id}`,
      { isActive: !toggleItem.isActive },
      {
        successMessage: "Page SEO status updated",
        errorMessage: "Failed to update Page SEO status",
      }
    );

    if (success) refetch();
    setToggleItem(null);
  }

  return (
    <div className="space-y-6">
      <ListHeader
        title="Page SEO"
        actionLabel="Create Page SEO"
        actionHref="/seo/create"
        createPermission="seo:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={() => {
          setSearch("");
          setIsActive("");
          setPage(1);
        }}
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
            placeholder="Select status"
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
                  <SortableTableHeader<PageSeoSortKey>
                    columnKey="pageKey"
                    label="Page"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<PageSeoSortKey>
                    columnKey="isActive"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<PageSeoSortKey>
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
              ) : pageSeos.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No page SEO found
                  </td>
                </tr>
              ) : (
                pageSeos.map((pageSeo) => (
                  <tr
                    key={pageSeo.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90 capitalize">
                      {pageSeo.pageKey}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {pageSeo.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(pageSeo.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/seo/${pageSeo.id}`}
                        editHref={`/seo/${pageSeo.id}/edit`}
                        onToggle={() => setToggleItem(pageSeo)}
                        isActive={pageSeo.isActive}
                        onDelete={() => setItem(pageSeo)}
                        editPermission="seo:update"
                        deletePermission="seo:delete"
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
        title={`Delete Page SEO: ${item?.pageKey}?`}
        message="If you just want to hide this page from SEO, consider marking it as inactive instead."
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
        title={`${toggleItem?.isActive ? "Deactivate" : "Activate"} Page SEO: ${
          toggleItem?.pageKey
        }?`}
        message={`This action will ${
          toggleItem?.isActive ? "deactivate" : "activate"
        } this page SEO.`}
        confirmText={toggleItem?.isActive ? "Deactivate" : "Activate"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
