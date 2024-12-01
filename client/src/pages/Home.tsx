import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import "../css/Home.css"; // Ensure you have the required CSS file
import "src/pages/challenges"

interface Challenge {
  _id: string;
  title: string;
  description: string;
  expiresAt: string;
  challengeType: string;
  reward: number;
}


const Home: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";

        const challengesResponse = await fetch(`${apiUrl}/api/activeChallenges`);
        if (!challengesResponse.ok) throw new Error("Failed to fetch challenges.");
        const challengesData = await challengesResponse.json();

        const username = localStorage.getItem("username");
        const userResponse = await fetch(`${apiUrl}/api/user/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user data.");
        const userData = await userResponse.json();

        setChallenges(challengesData);
        setActiveChallenges(userData.activeChallenges.map((challenge: any) => challenge._id));
        setCompletedChallenges(userData.completedChallenges.map((challenge: any) => challenge.challengeID));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchChallenges();
  }, []);

  const joinChallenge = async (challengeID: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/joinChallenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ challengeID }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        alert(`Error joining challenge: ${response.status} - ${response.statusText}`);
        return;
      }

      alert("Challenge joined successfully!");
      setActiveChallenges((prev) => [...prev, challengeID]);
    } catch (err) {
      console.error("Error joining challenge:", err);
      alert("An error occurred while joining the challenge. Please try again.");
    }
  };

  const completeChallenge = async (challengeID: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/completeChallenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ challengeID }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        alert(`Error completing challenge: ${response.status} - ${response.statusText}`);
        return;
      }

      alert("Challenge marked as completed!");
      setActiveChallenges((prev) => prev.filter((id) => id !== challengeID));
      setCompletedChallenges((prev) => [...prev, challengeID]);
    } catch (err) {
      console.error("Error completing challenge:", err);
      alert("An error occurred while completing the challenge. Please try again.");
    }
  };

  const renderButton = (challengeID: string) => {
    if (completedChallenges.includes(challengeID)) {
      return <button className="btn btn-disabled">Completed</button>;
    }
    if (activeChallenges.includes(challengeID)) {
      return <button className="btn btn-primary" onClick={() => completeChallenge(challengeID)}>Mark as Complete</button>;
    }
    return <button className="btn btn-primary" onClick={() => joinChallenge(challengeID)}>Join</button>;
  };

  const dailyChallenges = challenges.filter((challenge) => challenge.challengeType === "daily");
  const weeklyChallenges = challenges.filter((challenge) => challenge.challengeType === "weekly");

  return (
    <PageWrapper title="Home">
      <h1 className="animated-title">Daily Challenges</h1>
      <div className="carousel rounded-box max-w-5xl mx-auto p-4 space-x-4">
        {dailyChallenges.map((challenge) => (
          <div key={challenge._id} className="carousel-item">
            <div className="card bg-green-100 w-80 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-green-900">{challenge.title}</h2>
                <p>{challenge.description}</p>
                <div className="card-actions justify-end">
                  {renderButton(challenge._id)}
                </div>
                <div className="reward-tag">Reward: {challenge.reward} Aura Points</div>
                <p>Expires: {new Date(challenge.expiresAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h1 className="animated-title">Weekly Challenges</h1>
      <div className="carousel rounded-box max-w-5xl mx-auto p-4 space-x-4">
        {weeklyChallenges.map((challenge) => (
          <div key={challenge._id} className="carousel-item">
            <div className="card bg-blue-100 w-80 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-blue-900">{challenge.title}</h2>
                <p>{challenge.description}</p>
                <div className="card-actions justify-end">
                  {renderButton(challenge._id)}
                </div>
                <div className="reward-tag">Reward: {challenge.reward} Aura Points</div>
                <p>Expires: {new Date(challenge.expiresAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Home;
