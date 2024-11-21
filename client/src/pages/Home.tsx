import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  challengeType: "daily" | "weekly";
  expiresAt: string;
}

const Home: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";

        // Fetch all challenges
        const challengesResponse = await fetch(`${apiUrl}/api/activeChallenges`);
        const challengesData = await challengesResponse.json();

        // Fetch user data
        const username = localStorage.getItem("username");
        const userResponse = await fetch(`${apiUrl}/api/user/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const userData = await userResponse.json();

        setChallenges(challengesData);
        setActiveChallenges(userData.activeChallenges.map((challenge: any) => challenge._id));
        setCompletedChallenges(userData.completedChallenges.map((challenge: any) => challenge._id));
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const joinChallenge = async (challengeID: string) => {
    if (activeChallenges.includes(challengeID) || completedChallenges.includes(challengeID)) {
      alert("Challenge is already active or completed.");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const response = await fetch(`${apiUrl}/api/joinChallenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ challengeID }),
      });

      if (response.ok) {
        setActiveChallenges((prev) => [...prev, challengeID]);
        alert("Challenge joined successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Error joining challenge.");
      }
    } catch (error) {
      console.error("Error joining challenge:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const completeChallenge = async (challengeID: string) => {
    if (!activeChallenges.includes(challengeID)) {
      alert("Challenge is not active.");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const response = await fetch(`${apiUrl}/api/completeChallenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ challengeID }),
      });

      if (response.ok) {
        setActiveChallenges((prev) => prev.filter((id) => id !== challengeID));
        setCompletedChallenges((prev) => [...prev, challengeID]);
        alert("Challenge completed successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Error completing challenge.");
      }
    } catch (error) {
      console.error("Error completing challenge:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const renderButton = (challengeID: string) => {
    if (completedChallenges.includes(challengeID)) {
      return <Button disabled>Completed</Button>;
    }
    if (activeChallenges.includes(challengeID)) {
      return <Button onClick={() => completeChallenge(challengeID)}>Mark as Complete</Button>;
    }
    return <Button onClick={() => joinChallenge(challengeID)}>Join</Button>;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <PageWrapper title="Home">
      <h1>Challenges</h1>
      <div className="challenge-list">
        {challenges.map((challenge) => (
          <Card key={challenge._id} sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5">{challenge.title}</Typography>
              <Typography variant="body2">{challenge.description}</Typography>
              <Typography variant="caption">
                Type: {challenge.challengeType === "daily" ? "Daily" : "Weekly"}
              </Typography>
              <Typography variant="caption">
                Expires: {new Date(challenge.expiresAt).toLocaleDateString()}
              </Typography>
            </CardContent>
            <CardActions>{renderButton(challenge._id)}</CardActions>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Home;
