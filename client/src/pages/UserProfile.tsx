import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "src/components/PageWrapper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";

interface Challenge {
  title: string;
  description: string;
  challengeType: "daily" | "weekly";
  completedAt: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl =
          process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
        const response = await fetch(`${apiUrl}/api/user/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch user data.");
          return;
        }

        const data = await response.json();
        setUserData(data);
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
    <PageWrapper title="User Profile">
      {userData ? (
        <div className="user-profile">
          <Typography variant="h4" gutterBottom>
            {userData.firstName} {userData.lastName}
          </Typography>
          <Typography variant="body1">Username: @{userData.username}</Typography>
          <Typography variant="body1">Aura Points: {userData.auraPoints}</Typography>

          <Divider sx={{ margin: "20px 0" }} />

          <Typography variant="h5">Active Challenges</Typography>
          <div className="active-challenges">
            {userData.activeChallenges?.length > 0 ? (
              userData.activeChallenges.map((challenge, index) => (
                <Card key={index} sx={{ margin: "10px 0" }}>
                  <CardContent>
                    <Typography variant="h6">{challenge.title}</Typography>
                    <Typography variant="body2">{challenge.description}</Typography>
                    <Typography variant="caption">
                      Type: {challenge.challengeType === "daily" ? "Daily" : "Weekly"}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2">No active challenges yet.</Typography>
            )}
          </div>

          <Divider sx={{ margin: "20px 0" }} />

          <Typography variant="h5">Completed Challenges</Typography>
          <div className="completed-challenges">
            {userData.completedChallenges?.length > 0 ? (
              userData.completedChallenges.map((challenge, index) => (
                <Card key={index} sx={{ margin: "10px 0" }}>
                  <CardContent>
                    <Typography variant="h6">{challenge.title}</Typography>
                    <Typography variant="body2">{challenge.description}</Typography>
                    <Typography variant="caption">
                      Type: {challenge.challengeType === "daily" ? "Daily" : "Weekly"}
                    </Typography>
                    <Typography variant="caption">
                      Completed At: {new Date(challenge.completedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2">No challenges completed yet.</Typography>
            )}
          </div>
        </div>
      ) : (
        <Typography variant="body1">User not found</Typography>
      )}
    </PageWrapper>
  );
};

export default UserProfile;
