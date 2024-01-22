import { useCallback, useState } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async (config, applyData) => {
    setIsLoading(true);
    setDidSubmit(false);
    try {
      const response = await fetch(config.url, {
        method: config.method ? config.method : "GET",
        body: config.body ? config.body : null,
        headers: config.headers ? config.headers : {},
      });

      if (!response.ok) {
        throw new Error("Something went wrong, could NOT fetch players");
      }

      const data = await response.json();
      applyData(data);
    } catch (error) {
      setError("Failed to fetch");
    }

    setIsLoading(false);
    setDidSubmit(true);
  }, []);

  return {
    isLoading,
    didSubmit,
    error,
    managePlayerDataHandler: fetchPlayers,
  };
};

export default useHttp;
