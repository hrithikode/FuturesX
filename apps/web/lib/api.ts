import api from "@/lib/axios";


export const registerUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post(
    "/api/auth/register",
    data
  );

  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post(
    "/api/auth/login",
    data
  );

  return response.data;
};

export const getBalance = async () => {
  const response = await api.get(
    "/user/balance"
  );

  return response.data;
};


export const getOrders = async () => {
  const response = await api.get(
    "/trade/orders"
  );
  console.log("open orders: ", response.data)
  return response.data;
};

export const createOrder = async (data: {
  symbol: string;
  side: "long" | "short";
  qty: number;
  leverage: number;
}) => {
  const response = await api.post(
    "/trade/create",
    data
  );

  return response.data;
};

export const closeOrder = async (
  orderId: string
) => {
  const response = await api.post(
    `/trade/close/${orderId}`
  );

  return response.data;
};