import React, { useState } from "react";
import TextField from "@mui/material/TextField";


interface UpdateFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
  }) => void;
  challengeID: string | null;
}



const UpdateForm: React.FC<UpdateFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); 
  };


  

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
        <button type="submit">
          Update Challenge
        </button>
      </form>
    </div>
  );
};

export default UpdateForm;
