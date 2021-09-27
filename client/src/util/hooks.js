import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  return {
    handleChange,
    handleSubmit,
    formData,
  };
};
