import React, { useState } from "react";
//import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
//import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";


interface UpdateFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
  }) => void;
}

/*interface Challenge {
    _id: string;
    title: string;
    description: string;
  }*/

const UpdateForm: React.FC<UpdateFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    challenge: "",
  });
  //const [challenges, setChallenges] = useState<Challenge[]>([]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  /*const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, challenge: event.target.value as string });
  };*/

  /*const fetchUserCreatedChallenges = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const endpoint = "createdChallenges";
      const url = `${apiUrl}/api/${endpoint}`;
      const authToken = localStorage.getItem("authToken");

      console.log("Constructed URL:", url); // Debugging: log the constructed URL

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setChallenges(data);
      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user created challenges:", error);
    }
  };*/

  return(
    <div className="flex">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <TextField
          className=""
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          variant="outlined"
          label="Title"
        />
        <TextField
          className="border-2 border-cyan-300"
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          variant="outlined"
          label="Description"
        />
        <InputLabel id="type">Type</InputLabel>
        <button type="submit">
          Update Challenge
        </button>
      </form>
    </div>
  );
};

export default UpdateForm;
