
// import React, { useMemo } from 'react';
// import { useTable } from 'react-table';
// import { COLUMNS } from

// import React, { useState, useEffect } from "react";

import PageWrapper from "src/components/PageWrapper";

const data = [
    { name: "Anom - T", age: 200, gender: "Male" },
    { name: "Megha - T", age: 400, gender: "Female" },
    { name: "Subham - T", age: 700, gender: "Male" },
]

const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">
    <table>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Gender</th>
      </tr>
      {data.map((val, key) => {
        return (
          <tr key={key}>
              <td>{val.name}</td>
              <td>{val.age}</td>
              <td>{val.gender}</td>
          </tr>
          )
        })}
      </table>
    </p>
  </PageWrapper>
);

export default Rank;
