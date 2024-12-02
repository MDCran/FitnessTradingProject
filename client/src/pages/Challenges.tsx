import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import ChallengeForm from "src/components/ChallengeForm";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Backdrop from '@mui/material/Backdrop';
import UpdateForm from "src/components/UpdateForm";
import "src/css/StyleForChallenges.css";
import { blue } from "@mui/material/colors";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  challengeType: string;
  reward: number;
  expiresAt: string;
}

function Challenges() {
  const [open, setOpen] = useState<string | false>(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [yourchallenges, setYourChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const handleOpen = (operation: string, id?: string) => {
    setOpen(operation);
    if (id) {
      setSelectedChallenge(id);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const fetchChallenges = async (params: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");
      if (params === "") {
        params = " ";
      }
      const challengesResponse = await fetch(`${apiUrl}/api/Challenge?limit=5&page=${pageNum}&search=${params}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!challengesResponse.ok) throw new Error("Failed to fetch challenges.");
      const challengesData = await challengesResponse.json();

      //console.log(challengesData);
      setChallenges(challengesData.challenges);
      setTotal(challengesData.total);

      
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  
  useEffect(() => {
    fetchChallenges(searchInput);
    fetchYourChallenges();
    //console.log(challenges);
  },[searchInput, pageNum]);
  

  
    const deleteChallenge = async (ChallengeID: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");
      const endpoint = "deleteChallenge";
      const url = `${apiUrl}/api/${endpoint}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          challengeID: ChallengeID,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      fetchChallenges(searchInput);
      fetchYourChallenges();
    } catch (error) {
      console.error("Error updating challenge:", error);
      
    }
}

  const handleChallengeSubmit = async (formData: { title: string; description: string; challengeType: string}) => {
    console.log(formData);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const endpoint = "createChallenge";
      const url = `${apiUrl}/api/${endpoint}`;
      const authToken = localStorage.getItem("authToken");

      console.log("Constructed URL:", url); // Debugging: log the constructed URL

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          challengeType: formData.challengeType,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      fetchChallenges(searchInput);
      fetchYourChallenges();
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  const handleUpdateSubmit = async (formData: { title: string; description: string; }) => {
    console.log(formData);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const endpoint = "updateChallenge";
      const url = `${apiUrl}/api/${endpoint}`;
      const authToken = localStorage.getItem("authToken");

      console.log("Constructed URL:", url); // Debugging: log the constructed URL

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          challengeID: selectedChallenge,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      fetchChallenges(searchInput);
      fetchYourChallenges();
    } catch (error) {
      console.error("Error updating challenge:", error);
    }
  }

  const fetchYourChallenges = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${apiUrl}/api/createdChallenges`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error("Failed to fetch challenges.");
      const data = await response.json();

      //console.log(data);
      setYourChallenges(data);
      
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  const evaluateChallenge = (challenge: Challenge) => {
    let count = 0;
    let flag = true;
    yourchallenges.map((yourchallenge) => {
      count++;
      if (challenge._id !== yourchallenge._id) {
        flag = false;
      }
    })
    if (count == 0) {
      flag = false;
    }
    return flag;
  }

  const BackDropMapping: {[key: string]: React.ReactNode} = {
    create: (
    <div
    onClick={(e) => e.stopPropagation()}
    >
    <ChallengeForm onSubmit={handleChallengeSubmit} />
    </div>
  ),
    update: (
    <div
    onClick={(e) => e.stopPropagation()}
    >
    <UpdateForm onSubmit={handleUpdateSubmit} challengeID={selectedChallenge}/>
    </div>
  ),
  };


  return (
    <PageWrapper title="Challenges">
        <div className="search-challenge">
          <form>
            <input type="text" id="params" placeholder="Search challenges" onChange={(t) => {
              setSearchInput(t.target.value);
              setPageNum(1);
            }}></input>
          </form>
          <br></br>
        </div>
        {challenges.map((challenge) => (
          <div key={challenge._id}>
            <div className="card bg-green-100 w-[50rem] box-border border-green-900 border-1 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-green-900">{challenge.title}</h2>
                <p>{challenge.description}</p>
                <div className="reward-tag">Reward: {challenge.reward} Aura Points</div>
                <p>Expires: {new Date(challenge.expiresAt).toLocaleString()}</p>
                <div>
                  {evaluateChallenge(challenge)
                    ? (
                      <>
                      <button className="btn btn-primary" onClick={() => handleOpen("update", challenge._id)}>Update</button>
                      <button className="btn btn-danger" onClick={() => deleteChallenge(challenge._id)}>Delete</button>
                      </>
                    ) : (<></>)
                  }
                  
                </div>
              </div>
            </div>
          </div>))}
          <br></br>
        <div>
          {pageNum < 2 ? (<></>) : (<button className="btn btn-primary" onClick={() => setPageNum(pageNum - 1)}>Prev Page</button>)}
          {pageNum * 5 >= total ? (<></>) : (<button className="btn btn-primary" onClick={() => setPageNum(pageNum + 1)}>Next Page</button>)}
        </div>
        <Backdrop
        open={!!open}
        onClick={handleClose}
        style={{zIndex: 1000}}
        >
          {open && BackDropMapping[open]}
        </Backdrop>
        <SpeedDial
        ariaLabel="SpeedDial to handle challenge crud"
        sx={{ position: 'absolute', top: 100, right: 16, bgcolor: "oklch(.43 .15 283.08)"}}
        icon={<SpeedDialIcon />}
        >
        <SpeedDialAction
            key="Create"
            icon={<SpeedDialIcon />}
            tooltipTitle="Create Challenge"
            onClick={() => handleOpen("create")}
        />
        </SpeedDial>

    </PageWrapper>
  );
}

export default Challenges;
