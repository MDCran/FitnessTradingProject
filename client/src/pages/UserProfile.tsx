import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, List, ListItem, Divider } from "@mui/material";
import "../css/UserProfile.css"; // Add a CSS file for styling

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
        if (!response.ok) throw new Error("Failed to fetch user data.");
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 2 }}>
      {userData ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            {userData.firstName} {userData.lastName}
          </Typography>
          <Typography variant="body1">Username: @{userData.username}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Aura Points: {userData.auraPoints}
          </Typography>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Active Challenges
              </Typography>
              {userData.activeChallenges.length > 0 ? (
                <List>
                  {userData.activeChallenges.map((challenge, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Box>
                          <Typography variant="subtitle1">
                            <span className={`challenge-label ${challenge.challengeType}`}>
                              {challenge.challengeType.toUpperCase()}
                            </span>{" "}
                            <strong>{challenge.title}</strong>
                          </Typography>
                          <Typography variant="body2">{challenge.description}</Typography>
                        </Box>
                      </ListItem>
                      {index < userData.activeChallenges.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No active challenges.</Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Completed Challenges
              </Typography>
              {userData.completedChallenges.length > 0 ? (
                <List>
                  {userData.completedChallenges.map((challenge, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Box>
                          <Typography variant="subtitle1">
                            <span className={`challenge-label ${challenge.challengeType}`}>
                              {challenge.challengeType.toUpperCase()}
                            </span>{" "}
                            <strong>{challenge.title}</strong>
                          </Typography>
                          <Typography variant="body2">{challenge.description}</Typography>
                          <Typography variant="caption">
                            Completed on: {new Date(challenge.completedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < userData.completedChallenges.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No completed challenges.</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Typography>User not found.</Typography>
      )}
    </Box>
  );
};

export default UserProfile;
