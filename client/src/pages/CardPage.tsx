import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import { useParams } from "react-router-dom";
import "./cardpage.css";
import fitknightsVector from "src/fitknights_vector.svg";

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  auraPoints: number;
  //activeChallenges: Challenge[];
  //completedChallenges: Challenge[];
}

// function User() {
//   const fetchUser = async (params: string) => {
//     try {
//       const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
//       const authToken = localStorage.getItem("authToken");
//       if (params === "") {
//         params = " ";
//       }
//       const challengesResponse = await fetch(`${apiUrl}/api/user`, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       if (!challengesResponse.ok) throw new Error("Failed to fetch challenges.");
//       const challengesData = await challengesResponse.json();

//       setChallenges(challengesData.challenges);
//       setTotal(challengesData.total);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

// }
const CardPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };


  
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
    
    const card = document.querySelector<HTMLDivElement>(".pokemon-card-container");
    const glow = document.querySelector<HTMLDivElement>(".glow-effect");

    if (!card || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { width, height, left, top } = card.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;

      // Push-in effect
      card.style.transform = `perspective(1000px) rotateX(${y / 20}deg) rotateY(${-x / 20}deg) scale(0.95)`;

      // Glow effect
      glow.style.background = `radial-gradient(circle at ${50 - (x / width) * 100}% ${
        50 - (y / height) * 100
      }%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0))`;
    };

    const handleMouseLeave = () => {
      // Reset card position and glow
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      glow.style.background = `radial-gradient(circle, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))`;
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <PageWrapper title="CardPage">
      {userData ? (
      <div
        className={`pokemon-card-container ${isFlipped ? "flipped" : ""}`}
        onClick={handleCardClick}
      >

        {/* Front Side */}
        <div className="pokemon-card front">
          <div className="glow-effect"></div>
          <div className="card-header">
            <h2 className="username">{userData.username}</h2>
            <h3 className = "aurapoints">{userData.auraPoints}</h3>
            <h6 className = "aurapoints-label">Aura Points</h6>
          </div>
          <div className="card-image">
            <img
              src="https://images.unsplash.com/photo-1458349726531-234ad56ba80f?q=80&w=2362&auto=format&fit=crop"
              alt="Character"
            />
            <h4 className="username">@{userData.username}</h4>
          </div>
          <div className="card-logo">
            <img src={fitknightsVector} alt="Logo" />
          </div>
        </div>

        {/* Back Side */}
        <div className="pokemon-card back">
          <div className="card-details">
            <h2 className="title">Trainer: {userData.firstName} {userData.lastName}</h2>
            <h3 className="at">@{userData.username}</h3>
            <h4 className="skills">Rank</h4>
            <ul>
              <li>Aura Points: #{userData.auraPoints}</li>
              <li>Rank:</li>
            </ul>
            <h4 className="challenges">Challenges Completed</h4>
            <ul>
              <li>Challenge 1</li>
              <li>Challenge 2</li>
              <li>Challenge 3</li>
            </ul>
          </div>
        </div>
      </div>
      ) : (<h3 className="at">@</h3>)}
    </PageWrapper>
  );
};

export default CardPage;
