import React from "react";
import PageWrapper from "src/components/PageWrapper";
import "./App.css";

type RowData = {
  rank: number;
  username: string;
  auraPoints: number;
  pr: string;
  mile: string;
};

const Rank: React.FC = () => {
  const data: RowData[] = [
    {
      rank: 1,
      username: "Millicent",
      auraPoints: 40,
      pr: "315 kg",
      mile: "120.01 sec",
    },
    {
      rank: 2,
      username: "Siward",
      auraPoints: 30,
      pr: "215 kg",
      mile: "220.01 sec",
    },
    {
      rank: 3,
      username: "Sheree",
      auraPoints: 20,
      pr: "115 kg",
      mile: "320.01 sec",
    },
    // {
    //   id: 4,
    //   first_name: "Egor",
    //   last_name: "Downing",
    //   email: "edowning3@nymag.com",
    //   gender: "Male",
    //   university: "Universidad de Concepción del Uruguay",
    // },
    // {
    //   id: 5,
    //   first_name: "Donn",
    //   last_name: "Wilce",
    //   email: "dwilce4@answers.com",
    //   gender: "Male",
    //   university: "State University of New York at Binghamton",
    // },
    // {
    //   id: 6,
    //   first_name: "Kenon",
    //   last_name: "Jersch",
    //   email: "kjersch5@youtu.be",
    //   gender: "Male",
    //   university: "Université de Nantes",
    // },
  ];

  return (
    <PageWrapper title="Rank">
      <div className="Rank">
        <div className="container" style={{width: "1000px"}}>
          <table className="styled-table">
            <thead>
              <tr>
                <th className="highlight">RANK</th>
                <th>USER</th>
                <th>AURA POINTS</th>
                <th>PR</th>
                <th>MILE</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.rank}>
                  <td className="highlight">{row.rank}</td>
                  <td>{row.username}</td>
                  <td>{row.auraPoints}</td>
                  <td>{row.pr}</td>
                  <td>{row.mile}</td>
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
