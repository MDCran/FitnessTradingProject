
// import React, { useMemo } from 'react';
// import { useTable } from 'react-table';
// import { COLUMNS } from

// import React, { useState, useEffect } from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

import PageWrapper from "src/components/PageWrapper";

const columns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Age', accessor: 'age' },
  { Header: 'Country', accessor: 'country' },
];

const data = [
  { name: 'John', age: 25, country: 'USA' },
  { name: 'Jane', age: 30, country: 'UK' },
  { name: 'Alice', age: 22, country: 'Australia' },
];

const DataGrid = ({ columns, data, sortableColumns, pageSize }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: pageSize || 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    // Render the table and its components
  );
};



const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
    return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps(
                  sortableColumns.includes(column.id)
                    ? column.getSortByToggleProps()
                    : {}
                )}
              >
                {column.render('Header')}
                {sortableColumns.includes(column.id) ? (
                  column.isSorted ? (
                    column.isSortedDesc ? (
                      ' 🔽'
                    ) : (
                      ' 🔼'
                    )
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
    </p>
  </PageWrapper>
);

export default Rank;
