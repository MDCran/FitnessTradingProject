

// import React, { useMemo } from 'react';

// import { COLUMNS } from


// import React, { useState, useEffect } from "react";

import { useTable } from 'react-table';
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import PageWrapper from "src/components/PageWrapper";


const data = [
  { name: 'Product 1', price: 10.99 },
  { name: 'Product 2', price: 20.5 },
];

const columns = [
  { Header: 'Name', accessor: 'name' },
  {
    Header: 'Price',
    accessor: 'price',
    Cell: ({ value }) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    },
  },
];

function MyTable() {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow, 
  } = useTable({ columns, data });


const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
    </p>
  </PageWrapper>
);


export default Rank;



