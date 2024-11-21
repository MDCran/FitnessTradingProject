import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Challenge {
  title: string;
  description: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  completedChallenges: Challenge[];
  createdChallenges: Challenge[];
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "https://fitknights.xyz";
        const response = await fetch(`${apiUrl}/api/user/${username}`);

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <p>Loading user profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-profile">
      {userData ? (
        <div>
          <h1>
            {userData.firstName} {userData.lastName}
          </h1>
          <p>Username: @{userData.username}</p>

          <h2>Completed Challenges</h2>
          <div className="completed-challenges">
            {userData.completedChallenges.length > 0 ? (
              userData.completedChallenges.map((challenge, index) => (
                <div key={index} className="challenge-badge">
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                </div>
              ))
            ) : (
              <p>No challenges completed yet.</p>
            )}
          </div>

          <h2>Created Challenges</h2>
          <div className="created-challenges">
            {userData.createdChallenges.length > 0 ? (
              userData.createdChallenges.map((challenge, index) => (
                <div key={index} className="challenge-badge">
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                </div>
              ))
            ) : (
              <p>No challenges created yet.</p>
            )}
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserProfile;
