import React, { useEffect, useState } from "react";
import { calculateCountdown } from "src/utils/calculateCountdown";

type Challenge = {
  id: string;
  name: string;
  description: string;
  goals: { easy: string; medium: string; hard: string };
  rewards: { easy: number; medium: number; hard: number };
  completionCount: number;
  completedBy: { username: string; quantity: string }[];
  endDate: string;  // Expiration date of the challenge
};

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/daily-challenges`);
      const data = await response.json();
      setChallenges(data);
    };

    fetchChallenges();
  }, []);

  const handleCompleteChallenge = async (challengeId: string, quantity: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/complete-challenge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({ challengeId, quantity })
    });

    if (response.ok) {
      alert("Challenge marked as complete!");
    } else {
      alert("Error marking challenge as complete.");
    }
  };

  return (
    <div>
      <h1>Daily Challenges</h1>
      {challenges.map((challenge) => (
        <div key={challenge.id}>
          <h2>{challenge.name}</h2>
          <p>{challenge.description}</p>
          <ul>
            <li>Easy Goal: {challenge.goals.easy} - Reward: {challenge.rewards.easy} Aura Points</li>
            <li>Medium Goal: {challenge.goals.medium} - Reward: {challenge.rewards.medium} Aura Points</li>
            <li>Hard Goal: {challenge.goals.hard} - Reward: {challenge.rewards.hard} Aura Points</li>
          </ul>
          <p>Time Left: {calculateCountdown(challenge.endDate)}</p>
          <button onClick={() => {
            const quantity = prompt("Enter the quantity you completed (e.g., 10000 steps):");
            if (quantity) {
              handleCompleteChallenge(challenge.id, quantity);
            }
          }}>
            Mark as Complete
          </button>
          <p>Completed by: {challenge.completionCount} users</p>
        </div>
      ))}
    </div>
  );
};

export default DailyChallenges;
