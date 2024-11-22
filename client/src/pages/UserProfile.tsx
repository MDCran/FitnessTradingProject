import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Challenge {
  title: string;
  description: string;
  completedAt: string;
  challengeType: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  auraPoints: number;
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
        const response = await fetch(`${apiUrl}/api/user/${username}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Error fetching user data.");
        setUserData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-profile">
      {userData ? (
        <div>
          <h1>{userData.firstName} {userData.lastName}</h1>
          <p>Username: @{userData.username}</p>
          <p>Aura Points: {userData.auraPoints}</p>

          <h2>Active Challenges</h2>
          <ul>
            {userData.activeChallenges.map((challenge, index) => (
              <li key={index}>
                <strong>{challenge.title}</strong> - {challenge.description}
              </li>
            ))}
          </ul>

          <h2>Completed Challenges</h2>
          <ul>
            {userData.completedChallenges.map((challenge, index) => (
              <li key={index}>
                <strong>{challenge.title}</strong> - {challenge.description} <br />
                Completed on: {new Date(challenge.completedAt).toLocaleString()} ({challenge.challengeType})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default UserProfile;
