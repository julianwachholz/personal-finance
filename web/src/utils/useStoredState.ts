import { useState } from "react";

type UseState<T> = [T, (newValue: T) => void];

const useStoredState = <T>(name: string, defaultValue: T): UseState<T> => {
  const storedValue = localStorage.getItem(name);
  const initialValue: T = storedValue ? JSON.parse(storedValue) : defaultValue;
  const [value, setValue] = useState(initialValue);

  const setter = (newValue: T) => {
    localStorage.setItem(name, JSON.stringify(newValue));
    setValue(newValue);
  };
  return [value, setter];
};

export default useStoredState;
