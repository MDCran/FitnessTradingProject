import React, { useState } from "react";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
interface ChallengeFormProps{
    onSubmit: (formData: {title: string, description: string, challengeType: string}) => void;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({onSubmit}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    challengeType: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData({ ...formData, challengeType: event.target.value as string });
  };

  return (
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
          <Select
            labelId="type"
            id="type"
            value={formData.challengeType}
            label="Age"
            onChange={handleSelectChange}
          >
            <MenuItem value={"daily"}>Daily</MenuItem>
            <MenuItem value={"weekly"}>Weekly</MenuItem>
          </Select>
          <button className="bg-cyan-300" type="submit">
            Submit
          </button>
        </form>
      </div>
  );
}

export default ChallengeForm;
