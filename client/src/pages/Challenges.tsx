import React, { useEffect, useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import ChallengeForm from "src/components/ChallengeForm";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Backdrop from '@mui/material/Backdrop';
import UpdateForm from "src/components/UpdateForm";
import "src/css/StyleForChallenges.css";

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

      setChallenges(challengesData.challenges);
      setTotal(challengesData.total);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchChallenges(searchInput);
    fetchYourChallenges();
  }, [searchInput, pageNum]);

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
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const endpoint = "createChallenge";
      const url = `${apiUrl}/api/${endpoint}`;
      const authToken = localStorage.getItem("authToken");

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
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const endpoint = "updateChallenge";
      const url = `${apiUrl}/api/${endpoint}`;
      const authToken = localStorage.getItem("authToken");

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
  };

  const fetchYourChallenges = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${apiUrl}/api/createdChallenges`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error("Failed to fetch challenges.");
      const data = await response.json();
      setYourChallenges(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const evaluateChallenge = (challenge: Challenge) => {
    return yourchallenges.some((yourchallenge) => challenge._id === yourchallenge._id);
  };

  const BackDropMapping: { [key: string]: React.ReactNode } = {
    create: (
      <div onClick={(e) => e.stopPropagation()}>
        <ChallengeForm onSubmit={handleChallengeSubmit} />
      </div>
    ),
    update: (
      <div onClick={(e) => e.stopPropagation()}>
        <UpdateForm onSubmit={handleUpdateSubmit} challengeID={selectedChallenge} />
      </div>
    ),
  };

  return (
    <PageWrapper title="Challenges">
      <div className="search-challenge mb-5">
        <form>
          <input
            type="text"
            id="params"
            placeholder="Search challenges"
            className="input input-bordered w-full max-w-xs"
            onChange={(t) => {
              setSearchInput(t.target.value);
              setPageNum(1);
            }}
          />
        </form>
      </div>

      {challenges.map((challenge) => (
        <div key={challenge._id} className="mb-4">
          <div className="card bg-green-100 w-full max-w-4xl mx-auto shadow-xl rounded-lg overflow-hidden">
            <div className="card-body">
              <h2 className="card-title text-green-900 font-semibold text-2xl mb-2">{challenge.title}</h2>
              <p className="text-gray-700">{challenge.description}</p>
              <div className="reward-tag text-lg font-semibold mt-3">Reward: {challenge.reward} Aura Points</div>
              <p className="text-gray-500 mt-1">Expires: {new Date(challenge.expiresAt).toLocaleString()}</p>
              <div className="mt-4">
                {evaluateChallenge(challenge) ? (
                  <>
                    <button
                      className="btn btn-primary mr-2 rounded-full"
                      onClick={() => handleOpen("update", challenge._id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger rounded-full"
                      onClick={() => deleteChallenge(challenge._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="pagination mt-4 flex justify-between items-center">
        {pageNum > 1 && (
          <button
            className="btn btn-secondary rounded-full"
            onClick={() => setPageNum(pageNum - 1)}
          >
            Prev Page
          </button>
        )}
        {pageNum * 5 < total && (
          <button
            className="btn btn-secondary rounded-full"
            onClick={() => setPageNum(pageNum + 1)}
          >
            Next Page
          </button>
        )}
      </div>

      <Backdrop open={!!open} onClick={handleClose} style={{ zIndex: 1000 }}>
        {open && BackDropMapping[open]}
      </Backdrop>

      <SpeedDial
        ariaLabel="SpeedDial to handle challenge CRUD"
        sx={{ position: 'absolute', top: 100, right: 16, bgcolor: "transparent" }}
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
