import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function useBalance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    try {
        setLoading(true)

        const response = await api.get("/balance");

        console.log(response.data)

        setBalance(response.data.availableBalance);

      } catch (error) {

        console.error(error);

      } finally {
        
        setLoading(false)
      }
    };

  useEffect(() => {
    fetchBalance();
  }, []);

  return {
    balance,
    loading,
    fetchBalance
  };
}