import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();  // Extract username from URL
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'https://fitness-trading-project.vercel.app'}/api/user/${username}`
        );
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
          {/* Display other user info here */}
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserProfile;
