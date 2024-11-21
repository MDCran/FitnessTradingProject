import React from "react";
import { useTable, Column } from "react-table";
import PageWrapper from "src/components/PageWrapper";
import "./App.css";

// type RowData = {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   gender: string;
//   university: string;
// };

const Rank: React.FC = () => {
  const data: RowData[] = React.useMemo(
    () => [
      {
        id: 1,
        first_name: "Millicent",
        last_name: "Whatham",
        email: "mwhatham0@comsenz.com",
        gender: "Female",
        university: "Samarkand State University",
      },
      {
        id: 2,
        first_name: "Siward",
        last_name: "Amberger",
        email: "samberger1@behance.net",
        gender: "Male",
        university: "Institute of Industrial Electronics Engineering",
      },
      {
        id: 3,
        first_name: "Sheree",
        last_name: "Madeley",
        email: "smadeley2@google.com",
        gender: "Female",
        university: "Kateb Institute of Higher Education",
      },
      {
        id: 4,
        first_name: "Egor",
        last_name: "Downing",
        email: "edowning3@nymag.com",
        gender: "Male",
        university: "Universidad de Concepción del Uruguay",
      },
      {
        id: 5,
        first_name: "Donn",
        last_name: "Wilce",
        email: "dwilce4@answers.com",
        gender: "Male",
        university: "State University of New York at Binghamton",
      },
      {
        id: 6,
        first_name: "Kenon",
        last_name: "Jersch",
        email: "kjersch5@youtu.be",
        gender: "Male",
        university: "Université de Nantes",
      },
    ],
    []
  );

  const columns: Column<RowData>[] = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Gender", accessor: "gender" },
      { Header: "University", accessor: "university" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<RowData>({
    columns,
    data,
  });

  return (
    <PageWrapper title="Rank">
      {/* <div className="Rank">
        <div className="container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>University</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.first_name}</td>
                  <td>{row.last_name}</td>
                  <td>{row.email}</td>
                  <td>{row.gender}</td>
                  <td>{row.university}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </PageWrapper>
  );
};

export default Rank;
