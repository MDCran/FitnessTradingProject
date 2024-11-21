import PageWrapper from "src/components/PageWrapper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useFetch } from "src/hooks";
import { useState, useEffect } from "react";

const Home = () => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user || "");
    console.log("User:", user);
  }, []);
  const { userData, loading } = useFetch(username);
  const handleComplete = async (challenge: string) => {
    try {
      console.log("Challenge id:", challenge);
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const response = await fetch(`${apiUrl}/api/completeChallenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ challengeID: challenge }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "An error occurred");
        return;
      }
      alert("Challenge completed!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  if(loading) {
    return <p>Loading...</p>
  }
  return (
    <PageWrapper title="Home">
      <h1>Active Challenges</h1>
      <div className="flex flex-row justify-center">
        {userData ? (
          userData.createdChallenges?.length > 0 ? (
            userData.createdChallenges.map((challenge) => (
              <Card key={challenge._id} sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Challenge
                  </Typography>
                  <Typography variant="h5" component="div">
                    {challenge.title}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body2">{challenge.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleComplete(challenge._id)}>
                    Complete
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <p>No active challenges found.</p>
          )
        ) : (
          <p>User not found</p>
        )}
      </div>
      <h1>Completed Challenges</h1>
      <div className="flex flex-row justify-center">
        {userData ? (
          userData.completedChallenges?.length > 0 ? (
            userData.completedChallenges.map((challenge) => (
              <Card key={challenge._id} sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Challenge
                  </Typography>
                  <Typography variant="h5" component="div">
                    {challenge.title}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body2">{challenge.description}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No completed challenges found.</p>
          )
        ) : (
          <p>User not found</p>
        )}
      </div>
    </PageWrapper>
  );
};

export default Home;
