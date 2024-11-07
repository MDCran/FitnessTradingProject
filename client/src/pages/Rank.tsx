import PageWrapper from "src/components/PageWrapper";

import {
  useReactTable,
  getPaginationRowModel,
 } from '@tanstack/react-table';
 
 interface ReactTableProps<T extends object> {
  // ...
  showNavigation?: boolean;
 }
 
 export const Table = <T extends object>({
  // ...
  showNavigation = true,
 }: ReactTableProps<T>) => {
  const table = useReactTable({
    // ...
    getPaginationRowModel: getPaginationRowModel(),
  });
 
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden p-2">
            {/* ... */}
            {showNavigation ? (
              <>
                <div className="h-2 mt-5" />
                <div className="flex items-center gap-2">
                  <button
                    className="cursor-pointer rounded border p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {'<<'}
                  </button>
                  <button
                    className="cursor-pointer rounded border p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {'<'}
                  </button>
                  <button
                    className="cursor-pointer rounded border p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {'>'}
                  </button>
                  <button
                    className="cursor-pointer rounded border p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    {'>>'}
                  </button>
                  <span className="flex cursor-pointer items-center gap-1">
                    <div>Page</div>
                    <strong>
                      {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                      type="number"
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                        table.setPageIndex(page);
                      }}
                      className="w-16 rounded border p-1"
                    />
                  </span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                  <div className="h-4" />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
 };


const Rank = () => (
  <PageWrapper title="Rank">
    {/* <p className="tc f4 fw4 w-70">
      LEADERBOARD
      For testing table
    </p> */}
    

    <p>
      rip
    </p>

  </PageWrapper>
);

export default Rank;
