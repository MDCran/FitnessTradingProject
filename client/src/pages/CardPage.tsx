import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import "./cardpage.css";
import fitknightsVector from "src/fitknights_vector.svg";

const CardPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

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

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <PageWrapper title="CardPage">
      <div
        className={`pokemon-card-container ${isFlipped ? "flipped" : ""}`}
        onClick={handleCardClick}
      >
        {/* Front Side */}
        <div className="pokemon-card front">
          <div className="glow-effect"></div>
          <div className="card-header">
            <h2>Name: FitKnight</h2>
            <h3>Aura Points: 60</h3>
          </div>
          <div className="card-image">
            <img
              src="https://images.unsplash.com/photo-1458349726531-234ad56ba80f?q=80&w=2362&auto=format&fit=crop"
              alt="Character"
            />
            <h4 className="username">@FitKnightHero</h4>
          </div>
          <div className="card-logo">
            <img src={fitknightsVector} alt="Logo" />
          </div>
        </div>

        {/* Back Side */}
        <div className="pokemon-card back">
          <div className="card-details">
            <h2>Trainer: John Doe</h2>
            <h3>@FitKnightHero</h3>
            <h4>Skills:</h4>
            <ul>
              <li>Strength</li>
              <li>Endurance</li>
              <li>Agility</li>
            </ul>
            <h4>Challenges Completed:</h4>
            <ul>
              <li>5K Run</li>
              <li>Push-Up Mastery</li>
              <li>Marathon</li>
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CardPage;
