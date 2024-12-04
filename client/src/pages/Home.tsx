import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import "../css/Home.css";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  expiresAt: string;
  challengeType: string;
  reward: number;
}

const Home: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [currentDailySlide, setCurrentDailySlide] = useState(0); // For Daily Challenges
  const [currentWeeklySlide, setCurrentWeeklySlide] = useState(0); // For Weekly Challenges
  const [timers, setTimers] = useState<{ [key: string]: { hours: number; minutes: number; seconds: number } }>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);

    if (!authToken) return; // Stop fetching challenges if the user is not logged in

    const fetchChallenges = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";

        const challengesResponse = await fetch(`${apiUrl}/api/activeChallenges`);
        if (!challengesResponse.ok) throw new Error("Failed to fetch challenges.");
        const challengesData = await challengesResponse.json();

        const username = localStorage.getItem("username");
        const userResponse = await fetch(`${apiUrl}/api/user/${username}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user data.");
        const userData = await userResponse.json();

        setChallenges(challengesData);
        setActiveChallenges(userData.activeChallenges.map((challenge: any) => challenge._id));
        setCompletedChallenges(userData.completedChallenges.map((challenge: any) => challenge.challengeID));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      const updatedTimers = challenges.reduce((acc, challenge) => {
        const now = new Date().getTime();
        const expiration = new Date(challenge.expiresAt).getTime();
        const remaining = Math.max(expiration - now, 0);

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        acc[challenge._id] = { hours, minutes, seconds };
        return acc;
      }, {} as { [key: string]: { hours: number; minutes: number; seconds: number } });

      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [challenges, isLoggedIn]);

  const renderCarousel = (
    filteredChallenges: Challenge[],
    currentSlide: number,
    setSlide: React.Dispatch<React.SetStateAction<number>>,
    colorClass: string,
    titleColor: string
  ) => {
    const handlePrev = () => {
      setSlide((prev) => (prev === 0 ? filteredChallenges.length - 1 : prev - 1));
    };

    const handleNext = () => {
      setSlide((prev) => (prev === filteredChallenges.length - 1 ? 0 : prev + 1));
    };

    return (
      <div className="carousel w-full relative">
        {filteredChallenges.map((challenge, index) => (
          <div
            key={challenge._id}
            className={`carousel-item w-full ${
              index === currentSlide ? "block" : "hidden"
            } transition-all duration-500`}
          >
            <div className={`card ${colorClass} w-full shadow-xl`}>
              <div className="card-body">
                <h2 className={`card-title ${titleColor}`}>{challenge.title}</h2>
                <p>{challenge.description}</p>
                <div className="countdown font-mono text-2xl">
                  <span style={{ ["--value" as string]: timers[challenge._id]?.hours || 0 }}></span>h
                  <span style={{ ["--value" as string]: timers[challenge._id]?.minutes || 0 }}></span>m
                  <span style={{ ["--value" as string]: timers[challenge._id]?.seconds || 0 }}></span>s
                </div>
                <div className="expiration-date font-mono text-sm text-gray-500">
                  Expires at: {new Date(challenge.expiresAt).toLocaleString()}
                </div>
                <div className="card-actions justify-end">{renderButton(challenge._id)}</div>
                <div className="reward-tag">Reward: {challenge.reward} Aura Points</div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-primary"
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-primary"
        >
          ❯
        </button>
      </div>
    );
  };

  const renderButton = (challengeID: string) => {
    if (completedChallenges.includes(challengeID)) {
      return <button className="btn btn-disabled">Completed</button>;
    }
    if (activeChallenges.includes(challengeID)) {
      return <button className="btn btn-primary" onClick={() => completeChallenge(challengeID)}>Mark as Complete</button>;
    }
    return <button className="btn btn-primary" onClick={() => joinChallenge(challengeID)}>Join</button>;
  };

  const joinChallenge = async (challengeID: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/joinChallenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ challengeID }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        alert(`Error joining challenge: ${response.status} - ${response.statusText}`);
        return;
      }

      alert("Challenge joined successfully!");
      setActiveChallenges((prev) => [...prev, challengeID]);
    } catch (err) {
      console.error("Error joining challenge:", err);
      alert("An error occurred while joining the challenge. Please try again.");
    }
  };

  const completeChallenge = async (challengeID: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/completeChallenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ challengeID }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        alert(`Error completing challenge: ${response.status} - ${response.statusText}`);
        return;
      }

      alert("Challenge marked as completed!");
      setActiveChallenges((prev) => prev.filter((id) => id !== challengeID));
      setCompletedChallenges((prev) => [...prev, challengeID]);
    } catch (err) {
      console.error("Error completing challenge:", err);
      alert("An error occurred while completing the challenge. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <PageWrapper title="Home">
        <div className="header-section">
          <h1 className="header-title">Level Up Your Fitness</h1>
          <p className="header-description">
            Discover and participate in exciting daily and weekly challenges to earn aura and level up!
          </p>
        </div>
        <div className="not-logged-in-message">
          <h1>You must be logged in to view challenges!</h1>
          <p>Log in or Create an Account to Join!</p>
        </div>
      </PageWrapper>
    );
  }

  const dailyChallenges = challenges.filter((challenge) => challenge.challengeType === "daily");
  const weeklyChallenges = challenges.filter((challenge) => challenge.challengeType === "weekly");

  return (
    <PageWrapper title="Home">
      <div className="header-section">
        <h1 className="header-title">Level Up Your Fitness</h1>
        <p className="header-description">
          Discover and participate in exciting daily and weekly challenges to earn aura and level up!
        </p>
      </div>
      <h1 className="animated-title1">Daily Challenges</h1>
      {renderCarousel(dailyChallenges, currentDailySlide, setCurrentDailySlide, "bg-green-100", "text-green-900")}
      <h1 className="animated-title2">Weekly Challenges</h1>
      {renderCarousel(weeklyChallenges, currentWeeklySlide, setCurrentWeeklySlide, "bg-blue-100", "text-blue-900")}
    </PageWrapper>
  );
};

export default Home;
