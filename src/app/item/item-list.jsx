import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import ToggleStatus from "@/components/common/status-toggle";
import LoadingBar from "@/components/loader/loading-bar";
import { ITEMS_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useMemo, useState } from "react";
import ItemForm from "./item-form";

const ItemList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const params = useMemo(
    () => ({
      page: pageIndex + 1,
      per_page: pageSize,
      ...(debouncedSearch?.trim() && { search: debouncedSearch.trim() }),
    }),
    [pageIndex, pageSize, debouncedSearch]
  );

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: ITEMS_API.getlist,
    queryKey: ["item-list", pageIndex],
    params,
  });

  const columns = [
    { header: "HSN Code", accessorKey: "item_hsn_code" },
    { header: "Brand", accessorKey: "item_brand_name" },
    { header: "Generic", accessorKey: "item_generic_name" },
    { header: "Company", accessorKey: "item_company_name" },
    { header: "GST %", accessorKey: "item_gst" },
    {
      header: "Status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.item_status}
          apiUrl={ITEMS_API.updateStatus(row.original.id)}
          payloadKey="item_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <ItemForm editId={row.original.id} onSuccess={refetch} />
      ),
    },
  ];

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {isLoading && <LoadingBar />}
      <DataTable
        data={data?.data?.data || []}
        columns={columns}
        searchPlaceholder="Search item..."
        toolbarRight={<ItemForm onSuccess={refetch} />}
        serverPagination={{
          pageIndex,
          pageCount: data?.last_page ?? 1,
          total: data?.total ?? 0,
          onPageChange: setPageIndex,
          onPageSizeChange: setPageSize,
          onSearch: setSearch,
        }}
      />
    </>
  );
};

export default ItemList;
