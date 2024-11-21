

// import React, { useMemo } from 'react';
// import { useTable } from 'react-table';
// import { COLUMNS } from


// import React, { useState, useEffect } from "react";


import PageWrapper from "src/components/PageWrapper";

// This could be on diff script
interface IEmployee {  
  id: number,  
  firstName: string;  
  lastName: string;  
  email: string;  
  department: string;  
  dateJoined: string;  
}

import { ColumnDef } from "@tanstack/react-table";  
// import { IEmployee } from "../../utils/types";

export const COLUMNS: ColumnDef<IEmployee>[] = [  
  {  
    header: "ID",  
    accessorKey: "id_number",  
  },  
  {  
    header: "First Name",  
    accessorKey: "firstName",  
  },  
  {  
    header: "Last Name",  
    accessorKey: "lastName",  
  },  
  {  
    header: "Email",  
    accessorKey: "email",  
  },  
  {  
    header: "Department",  
    accessorKey: "department",  
  },  
  {  
    header: "Date Joined",  
    accessorKey: "dateJoined",  
  },  
];

import {  
  useReactTable,  
  getCoreRowModel,  
  flexRender,  
} from "@tanstack/react-table";  
import {  
  Table,  
  TableContainer,  
  Tbody,  
  Td,  
  Tfoot,  
  Th,  
  Thead,  
  Tr,  
} from "@chakra-ui/react";

const ReactTable = () => {  
  const [data, setData] = useState<IEmployee[]>([]);

  // useEffect() to fetch data ...

  const columns = useMemo(() => COLUMNS, []);

  const table = useReactTable({  
    columns,  
    data,  
    getCoreRowModel: getCoreRowModel(),  
  });

  return <div>...</div>;  
};

const Rank = () => (
  <PageWrapper title="Rank">
    <p className="tc f4 fw4 w-70">

    const { getHeaderGroups, getRowModel, getFooterGroups } = table;


      <TableContainer p={8}>  
      <Heading>React Table Example</Heading>  
      <Table>  
        <Thead>  
          {getHeaderGroups().map((headerGroup) => (  
            <Tr key={headerGroup.id}>  
              {headerGroup.headers.map((header) => (  
                <Th key={header.id}>  
                  {flexRender(header.column.columnDef.header, header.getContext())}  
                </Th>  
              ))}  
            </Tr>  
          ))}  
        </Thead>  
        <Tbody>  
          {getRowModel().rows.map((row) => (  
            <Tr key={row.id}>  
              {row.getVisibleCells().map((cell) => (  
                <Td key={cell.id}>  
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}  
                </Td>  
              ))}  
            </Tr>  
          ))}  
        </Tbody>  
        <Tfoot>  
          {getFooterGroups().map((footerGroup) => (  
            <Tr key={footerGroup.id}>  
              {footerGroup.headers.map((header) => (  
                <Th key={header.id}>  
                  {flexRender(header.column.columnDef.footer, header.getContext())}  
                </Th>  
              ))}  
            </Tr>  
          ))}  
        </Tfoot>  
      </Table>  
    </TableContainer>  
    </p>
  </PageWrapper>
);


export default Rank;