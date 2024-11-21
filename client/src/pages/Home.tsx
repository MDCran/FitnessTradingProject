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
  expiresAt: string;
  challengeType: string;
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

        const challengesResponse = await fetch(`${apiUrl}/api/activeChallenges`);
        const challengesData = await challengesResponse.json();

        const username = localStorage.getItem("username");
        const userResponse = await fetch(`${apiUrl}/api/user/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const userData = await userResponse.json();

        setChallenges(challengesData);
        setActiveChallenges(userData.activeChallenges.map((c: any) => c._id));
        setCompletedChallenges(userData.completedChallenges.map((c: any) => c.challengeID));
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const joinChallenge = async (challengeID: string) => {
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
      alert("Error joining challenge.");
    }
  };

  const completeChallenge = async (challengeID: string) => {
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
      alert("Error completing challenge.");
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
                {challenge.challengeType.toUpperCase()} | Expires:{" "}
                {new Date(challenge.expiresAt).toLocaleDateString()}
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
