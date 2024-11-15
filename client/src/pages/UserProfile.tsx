import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ChallengeBadge {
  name: string;
  type: "daily" | "weekly";
  dateCompleted: string;
  goalAchieved: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  completedChallenges: ChallengeBadge[];
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/user/${username}`);
        const data = await response.json();
        
        if (response.ok) {
          setUserData(data);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {userData ? (
        <div>
          <h1>{userData.firstName} {userData.lastName}</h1>
          <p>Username: @{userData.username}</p>

          <h2>Completed Challenges</h2>
          <div className="completed-challenges">
            {userData.completedChallenges.length > 0 ? (
              userData.completedChallenges.map((badge, index) => (
                <div key={index} className="challenge-badge">
                  <p>Challenge: {badge.name}</p>
                  <p>Type: {badge.type === "daily" ? "Daily Challenge" : "Weekly Challenge"}</p>
                  <p>Goal Achieved: {badge.goalAchieved}</p>
                  <p>Date Completed: {new Date(badge.dateCompleted).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No challenges completed yet.</p>
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
