

// import React, { useMemo } from 'react';

// import { COLUMNS } from


// import React, { useState, useEffect } from "react";


import PageWrapper from "src/components/PageWrapper";

import * as React from "react";
import { useTable } from "react-table";



// const data = React.useMemo(() => fakeData, []);
const data =  [
  {"id":1,"first_name":"Millicent","last_name":"Whatham","email":"mwhatham0@comsenz.com","gender":"Female","university":"Samarkand State University"},
  {"id":2,"first_name":"Siward","last_name":"Amberger","email":"samberger1@behance.net","gender":"Male","university":"Institute of Industrial Electronics Engineering"},
  {"id":3,"first_name":"Sheree","last_name":"Madeley","email":"smadeley2@google.com","gender":"Female","university":"Kateb Institute of Higher Education"},
  {"id":4,"first_name":"Egor","last_name":"Downing","email":"edowning3@nymag.com","gender":"Male","university":"Universidad de Concepción del Uruguay"}
]

const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "University",
        accessor: "university",
      },
    ],
    []
);

const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });


const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
    return (
    <div className="App">
      <div className="container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
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
                    <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
    </p>
  </PageWrapper>
);


export default Rank;



