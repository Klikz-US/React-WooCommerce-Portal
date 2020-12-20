import { useState, useEffect } from "react";

export const useFormSwitch = (initialValue) => {
  const [checked, setChecked] = useState(initialValue);

  useEffect(() => {
    setChecked(initialValue);
  }, [initialValue, setChecked]);

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  return {
    checked,
    onChange: handleChange,
  };
};
