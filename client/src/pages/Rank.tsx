import React, {useEffect,useState} from "react";
import PageWrapper from "src/components/PageWrapper";
import "./App.css";

type RowData = {
  username: string;
  auraPoints: number;
};

const Rank: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  
  useEffect(() => {
    const fetchRank = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
        const response = await fetch(`${apiUrl}/api/rank`);
        if (!response.ok) throw new Error("Failed to fetch rank.");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching rank:", error);
      }
    };

    fetchRank();
  }, []);
  return (
    <PageWrapper title="LEADERBOARD">
      <div className="Rank">
        <div className="container" style={{width: "1100px"}}>
          <table className="styled-table">
            <thead>
              <tr>
                <th className="highlight">RANK</th>
                <th>USER                        </th>
                <th>AURA POINTS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="highlight1">{index}</td>
                  <td className="highlight2">{row.username}</td>
                  <td className="highlight3">{row.auraPoints}</td>
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
