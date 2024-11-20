import { useEffect, useState } from "react";


interface Challenge {
    title: string;
    description: string;
    _id: string;
  }
  
  interface UserData {
    firstName: string;
    lastName: string;
    username: string;
    completedChallenges: Challenge[];
    createdChallenges: Challenge[];
  }
  
  const useFetch = (username : string) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
    if (!username) return;
      const fetchUserData = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
          const response = await fetch(`${apiUrl}/api/user/${username}`);
          const data = await response.json();
          
          if (response.ok) {
            setUserData(data);
          } else {
            console.error("Error fetching user data:", data.message);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, [username]);
  
   return {userData, loading};
};

export default useFetch;