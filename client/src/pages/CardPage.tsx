import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
// import { useParams } from "react-router-dom";
import "./cardpage.css";
import fitknightsVector from "src/fitknights_vector.svg";
import "../css/UserProfile.css"; // Add a CSS file for styling

// interface Challenge {
//   title: string;
//   description: string;
//   completedAt: string;
//   challengeType: string;
// }

// interface UserData {
//   firstName: string;
//   lastName: string;
//   username: string;
//   auraPoints: number;
//   activeChallenges: Challenge[];
//   completedChallenges: Challenge[];
// }

const CardPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  // const { username } = useParams<{ username: string }>();
  // const [userData, setUserData] = useState<UserData | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {

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

    console.log("version 3");
    
    // const fetchUserData = async () => {
    // setLoading(true);
    // try {
    //     console.log("Fetching data...");
    //     const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
    //     console.log(apiUrl);
    //     const response = await fetch(`${apiUrl}/api/user/${username}`);  //<-- THIS IS THE PROBLEM LINE; never finishes loading / exits prematurely
    //     console.log("Response:", response);
    
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch user data.");
    //     }
    
    //     const data = await response.json();
    //     console.log(typeof(data));
    //     console.log("Fetched data:", data);
    //     setUserData(data);
    // } catch (err) {
    //     console.error("Error occurred:", err);
    //     setError("An error occurred while fetching user data.");
    // } finally {
    //     console.log("Setting loading to false");
    //     setLoading(false);
    // }
    // };
    
    // fetchUserData();
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [/*username*/]);

  
  // if (loading) return <h2 className="username">loadingstill</h2>;
  // if (error) return <h2 className="username">errorstill</h2>;

  return (
    <PageWrapper title="Upcoming Updates: CardPage">
      <div
        className={`pokemon-card-container ${isFlipped ? "flipped" : ""}`}
        onClick={handleCardClick}
      >

        {/* Front Side */}
        <div className="pokemon-card front">
          <div className="glow-effect"></div>
          <div className="card-header">
            <h2 className="username">Your Name Here</h2>
            <h3 className = "aurapoints">32</h3>
            <h6 className = "aurapoints-label">Aura Points</h6>
          </div>
          <div className="card-image">
            <img
              src="https://images.unsplash.com/photo-1458349726531-234ad56ba80f?q=80&w=2362&auto=format&fit=crop"
              alt="Character"
            />
            <h4 className="username">@FitKnight</h4>
          </div>
          <div className="card-logo">
            <img src={fitknightsVector} alt="Logo" />
          </div>
        </div>

        {/* Back Side */}
        <div className="pokemon-card back">
          <div className="card-details">
            <h2 className="title">Trainer: Your Name Here</h2>
            <h3 className="at">@FitKnight</h3>
            <h4 className="skills">Rank</h4>
            <ul>
              <li>Aura Points: 32</li>
              <li>Rank: 5</li>
            </ul>
            <h4 className="challenges">Challenges Completed</h4>
            <ul>
              <li>Daily: Drink water</li>
              <li>Daily: Run one mile</li>
              <li>Weekly: Heavy set of squats</li>
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CardPage;
