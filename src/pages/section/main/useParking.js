import { useCallback, useState } from "react";
import  supabase  from "../../../api/supabaseClient";

export function useParkings() {
  const [lots, setLots] = useState([]);
  const [loadingMain, setLoadingMain] = useState(false);
  const [error, setError] = useState(null);

  const fetchParkingLots = useCallback(async () => {
    setLoadingMain(true);
    setError(null);

    const { data, error } = await supabase
      .from("parkings")
      .select("id, name, addr, lat, lng")
      .order("id", { ascending: true });

    if (error) {
      setError(error.message);
      setLots([]);
    } else {
      setLots(data ?? []);
    }

    setLoadingMain(false);
  }, []);

  return { lots, fetchParkingLots, loadingMain, error };
}

