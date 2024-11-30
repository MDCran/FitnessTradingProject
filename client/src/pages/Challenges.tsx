import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import ChallengeForm from "src/components/ChallengeForm";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Backdrop from '@mui/material/Backdrop';
import UpdateForm from "src/components/UpdateForm";

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
  //const [cbuffer, setCBuffer] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [pageNum, setPageNum] = useState(0);
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
    //params = params.toLowerCase();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");
      const challengesResponse = await fetch(`${apiUrl}/api/Challenge?limit=5&page=${pageNum}&search=${params}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!challengesResponse.ok) throw new Error("Failed to fetch challenges.");
      const challengesData = await challengesResponse.json();
      //setCBuffer(challengesData.challenges);

      /*
      const visibleChallenges: Challenge[] = [];
      if (params != "") {
        cbuffer.map((challenge) => {
          if (challenge.title.toLowerCase().includes(params)) {
            visibleChallenges.push(challenge);
          }
        });
        //console.log(visibleChallenges);
        setChallenges(visibleChallenges);
      } else {
        //console.log(challengesData);
        setChallenges(challengesData);
      }
      */
      

      //console.log(challengesData);
      setChallenges(challengesData.challenges);

      
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  //fetchChallenges(searchInput);

  
  useEffect(() => {
    fetchChallenges(searchInput);
    //console.log(challenges);
  },[challenges]);
  

  
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
    } catch (error) {
      console.error("Error updating challenge:", error);
    }
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
            <input type="text" id="params" placeholder="Search challenges" onChange={(t) => setSearchInput(t.target.value)}></input>
          </form>
          <br></br>
        </div>
        {challenges.map((challenge) => (
          <div key={challenge._id}>
            <div className="card bg-green-100 w-80 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-green-900">{challenge.title}</h2>
                <p>{challenge.description}</p>
                <div className="reward-tag">Reward: {challenge.reward} Aura Points</div>
                <p>Expires: {new Date(challenge.expiresAt).toLocaleString()}</p>
                <div>
                  <button className="btn btn-primary" onClick={() => handleOpen("update", challenge._id)}>Update</button>
                  <button className="btn btn-danger" onClick={() => deleteChallenge(challenge._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>))}
        <Backdrop
        open={!!open}
        onClick={handleClose}
        style={{zIndex: 1000}}
        >
          {open && BackDropMapping[open]}
        </Backdrop>
        <SpeedDial
        ariaLabel="SpeedDial to handle challenge crud"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
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
