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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const joinChallenge = async (challengeID: string) => {
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

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Error joining challenge.");
        return;
      }

      setActiveChallenges((prev) => [...prev, challengeID]);
    } catch (err) {
      console.error("Error joining challenge:", err);
    }
  };

  const renderButton = (challengeID: string) => {
    if (completedChallenges.includes(challengeID)) {
      return <Button disabled>Completed</Button>;
    }
    if (activeChallenges.includes(challengeID)) {
      return <Button disabled>Active</Button>;
    }
    return <Button onClick={() => joinChallenge(challengeID)}>Join</Button>;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <PageWrapper title="Home">
      <h1>Challenges</h1>
      <div className="challenge-list">
        {challenges.map((challenge) => (
          <Card key={challenge._id}>
            <CardContent>
              <Typography variant="h5">{challenge.title}</Typography>
              <Typography>{challenge.description}</Typography>
              <Typography variant="caption">
                {challenge.challengeType.toUpperCase()} | Expires:{" "}
                {new Date(challenge.expiresAt).toLocaleString()}
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
