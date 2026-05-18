"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrders, createOrder, closeOrder} from "@/lib/api";
import type { Order } from "@/types/order";
import { toast } from "sonner";


export default function useOrders(
  fetchBalance: () => Promise<void>,
  setCreateOrderLoading: (value: boolean) => void,
  setLoadingOrderId: (value: string | null) => void
) {

  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [closedOrders, setClosedOrders] = useState<Order[]>([]);


  const fetchOrders = useCallback( async () => {
    try {
      const data = await getOrders();

      setOpenOrders(data.openOrders);
      setClosedOrders(data.closedOrders);
    } catch (error) {
      console.error(error);
      toast.error("failed to fetch order")
    }
  },[]
);

  const handleCreateOrder = async (
    side: "long" | "short",
    quantity: string,
    leverage: number
  ) => {
    try {
      setCreateOrderLoading(true);
      
      await createOrder({
        symbol: "BTCUSDT",
        side,
        qty: Number(quantity),
        leverage,
      });

      await fetchOrders();
      await fetchBalance();

      toast.success("Order Created Successfully")
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order");
    } finally {
      setCreateOrderLoading(false);
    }
  };

  const handleCloseOrder = async (
    orderId: string
  ) => {
    try {
      setLoadingOrderId(orderId);
      await closeOrder(orderId);

      await fetchOrders();
      await fetchBalance();

      toast.success("Order Closed Successfully")
    } catch (error) {
      console.error(error);
      toast.error("Failed to close order");
    } finally {
      setLoadingOrderId(null);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    openOrders,
    closedOrders,
    fetchOrders,
    handleCreateOrder,
    handleCloseOrder,
  };
}