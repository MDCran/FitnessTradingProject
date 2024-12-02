import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import { motion } from "framer-motion"; // Import motion for animations

type RowData = {
  username: string;
  auraPoints: number;
};

const Rank: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const currentUsername = process.env.REACT_APP_CURRENT_USERNAME || "currentUser"; // Replace this with actual logic

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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
    <PageWrapper title="Leaderboard">
      <div className="Rank bg-white p-5">
        <div className="container mx-auto" style={{ maxWidth: "1500px" }}>
          <motion.table
            className="styled-table w-full table-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <thead>
              <tr className="bg-accent text-white">
                <th className="p-3">RANK</th>
                <th className="p-3">USER</th>
                <th className="p-3">AURA POINTS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <motion.tr
                  key={index}
                  className={`text-center ${
                    row.username === currentUsername ? "bg-yellow-200 font-bold" : index % 2 === 0 ? "bg-gray-100" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                  }}
                >
                  <motion.td className="p-6 max-width" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                    {index + 1}
                  </motion.td>
                  <motion.td className="p-3 max-width">
                    <div className="flex items-start justify-start gap-3 w-full">
                      <motion.div
                        className="mask mask-squircle h-12 w-12"
                        style={{ backgroundColor: getRandomColor() }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.span className="font-medium">{row.username}</motion.span>
                    </div>
                  </motion.td>
                  <motion.td className="p-3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                    {row.auraPoints}
                  </motion.td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Rank;
