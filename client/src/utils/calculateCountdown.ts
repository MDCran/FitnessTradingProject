// src/utils/calculateCountdown.ts

export const calculateCountdown = (endDate: string): string => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const difference = end - now;
  
    if (difference <= 0) return "Challenge expired";
  
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
    return `${hours}h ${minutes}m ${seconds}s remaining`;
  };
  