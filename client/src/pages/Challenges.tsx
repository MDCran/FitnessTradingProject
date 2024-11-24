import React, { useState } from "react";
import PageWrapper from "src/components/PageWrapper";
import ChallengeForm from "src/components/ChallengeForm";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Backdrop from '@mui/material/Backdrop';



function Challenges() {
  const [open, setOpen] = useState<string | false>(false);
  const handleOpen = (operation: string) => {
    setOpen(operation);
  };
  const handleClose = () => {
    setOpen(false);
  };

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

  const BackDropMapping: {[key: string]: React.ReactNode} = {
    create: (
    <div
    onClick={(e) => e.stopPropagation()}
    >
    <ChallengeForm onSubmit={handleChallengeSubmit} />
    </div>
  ),
  };


  return (
    <PageWrapper title="challenge">
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
        <SpeedDialAction
            key="Update"
            icon={<SpeedDialIcon />}
            tooltipTitle="Update Challenge"
            onClick={() => console.log("Create Challenge")}
        />
        <SpeedDialAction
            key="Delete"
            icon={<SpeedDialIcon />}
            tooltipTitle="Delete Challenge"
            onClick={() => console.log("Create Challenge")}
        />
        </SpeedDial>
    </PageWrapper>
  );
}

export default Challenges;
