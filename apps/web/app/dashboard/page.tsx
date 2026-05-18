"use client"

import Header from "@/components/TradingDashboard/Header";
import LeftSidebar from "@/components/TradingDashboard/LeftSidebar";
import OrdersSection from "@/components/TradingDashboard/OrdersSection";
import GraphSection from "@/components/TradingDashboard/GraphSection";
import RightOrderSection from "@/components/TradingDashboard/RightOrderSection";
import useBalance from "@/hooks/useBalance";
import useOrders from "@/hooks/useOrders";
import { useState } from "react";


export default function DashboardPage() {
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null)
  const { balance, fetchBalance } = useBalance();
  const { openOrders, closedOrders, handleCreateOrder, handleCloseOrder} = useOrders(fetchBalance, setCreateOrderLoading, setLoadingOrderId);


  return (
    <div className="h-screen flex flex-col">

      <Header
        balance={balance}
      />

      <div className="flex-1 grid grid-cols-12">

        <div className="col-span-2 border-r">
          <LeftSidebar/>
        </div>

        <div className="col-span-7 flex flex-col">
          <div className="h-[55%] border-b">
            <GraphSection />
          </div>

          <div className="h-[45%] overflow-y-auto">
            <OrdersSection
              openOrders={openOrders}
              closedOrders={closedOrders}
              handleCloseOrder={handleCloseOrder}
              loadingOrderId={loadingOrderId}
            />
          </div>
        </div>

        <div className="col-span-3 border-l">
          <RightOrderSection
            handleCreateOrder={handleCreateOrder}
            createOrderLoading={createOrderLoading}
          />
        </div>

      </div>


    </div>
  );
}