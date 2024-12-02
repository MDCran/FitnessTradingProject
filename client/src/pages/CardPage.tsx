import React, { useEffect } from "react";
import PageWrapper from "src/components/PageWrapper";
import "./cardpage.css";
import fitknightsVector from "src/fitknights_vector.svg";

const CardPage: React.FC = () => {
  useEffect(() => {
    initTiltEffect(); // Initialize the hover effect after the component mounts
  }, []);

  return (
    <PageWrapper title="CardPage">
      <div className="mdcran-logo-container">
        <div className="mdcran-overlay"></div>
        <img className="mdcran-logo" src={fitknightsVector} alt="Logo" />
      </div>
    </PageWrapper>
  );
};

export default CardPage;

const initTiltEffect = (): void => {
  const logoContainer = document.querySelector<HTMLDivElement>(".mdcran-logo-container");
  const logoImage = document.querySelector<HTMLImageElement>(".mdcran-logo");
  const overlay = document.querySelector<HTMLDivElement>(".mdcran-overlay");

  if (!logoContainer || !logoImage || !overlay) return;

  const tiltIntensity = 50;

  let isHovered = false;

  // Handle mouse enter
  logoContainer.addEventListener("mouseenter", () => {
    isHovered = true;
    overlay.style.transition = "opacity 2s ease-in";
    overlay.style.opacity = "0.5"; // Fade in overlay
  });

  // Handle mouse leave
  logoContainer.addEventListener("mouseleave", () => {
    isHovered = false;
    overlay.style.transition = "opacity 2s ease-out, transform 0.5s ease-out";
    overlay.style.opacity = "0"; // Fade out overlay
    logoImage.style.transition = "transform 0.5s ease-out";
    logoImage.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    overlay.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  });

  // Handle mouse move
  logoContainer.addEventListener("mousemove", (e: MouseEvent) => {
    const tiltX = -(e.clientY / window.innerHeight - 0.5) * tiltIntensity;
    const tiltY = (e.clientX / window.innerWidth - 0.5) * tiltIntensity;

    logoImage.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    overlay.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    const containerRect = logoContainer.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;

    const offsetX = containerCenterX - e.clientX;
    const offsetY = containerCenterY - e.clientY;

    overlay.style.backgroundPositionX = `${offsetX}px`;
    overlay.style.backgroundPositionY = `${offsetY}px`;
  });

  overlay.style.background = `radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 250px)`;
  overlay.style.backgroundRepeat = "no-repeat";
};
