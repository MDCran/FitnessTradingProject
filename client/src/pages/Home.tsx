import PageWrapper from "src/components/PageWrapper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";

// Define types for challenges
interface Challenge {
  _id: string;
  title: string;
  description: string;
  expiresAt: string;
}

const Home = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]); // Typed as an array of Challenge
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]); // Typed as an array of strings (IDs)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";

        // Fetch active challenges
        const challengesResponse = await fetch(`${apiUrl}/api/activeChallenges`);
        const challengesData: Challenge[] = await challengesResponse.json(); // Use the Challenge type

        // Fetch user data to get active challenges
        const username = localStorage.getItem("username");
        const userResponse = await fetch(`${apiUrl}/api/user/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const userData = await userResponse.json();

        setChallenges(challengesData);
        setActiveChallenges(userData.activeChallenges.map((challenge: any) => challenge._id));
      } catch (error) {
        console.error("Error fetching challenges:", error);
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
        alert(data.message || "Failed to join challenge.");
        return;
      }

      setActiveChallenges((prev) => [...prev, challengeID]);
      alert("Challenge joined successfully!");
    } catch (error) {
      console.error("Error joining challenge:", error);
    }
  };

  const completeChallenge = async (challengeID: string) => {
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

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to complete challenge.");
        return;
      }

      setActiveChallenges((prev) => prev.filter((id) => id !== challengeID));
      alert("Challenge completed successfully!");
    } catch (error) {
      console.error("Error completing challenge:", error);
    }
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
                Expires: {new Date(challenge.expiresAt).toLocaleDateString()}
              </Typography>
            </CardContent>
            <CardActions>
              {activeChallenges.includes(challenge._id) ? (
                <Button onClick={() => completeChallenge(challenge._id)}>Complete</Button>
              ) : (
                <Button onClick={() => joinChallenge(challenge._id)}>Join</Button>
              )}
            </CardActions>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Home;
