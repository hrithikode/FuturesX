"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useMarketPrice from "@/hooks/useMarketPrice";
import { toast } from "sonner";


type Props = {
  handleCreateOrder: (
    side: "long" | "short",
    quantity: string,
    leverage: number
  ) => Promise<void>;
  createOrderLoading: boolean;
};

export default function RightOrderSection({
  handleCreateOrder,
  createOrderLoading,
}: Props) {
  
  const [quantity, setQuantity] = useState("");
  const [leverage, setLeverage] = useState(1);
  const [positionType, setPositionType] = useState<"long" | "short">("long");
  const { marketPrice } = useMarketPrice();

  const handlePlaceOrder = async () => {
    if (!quantity || Number(quantity) <= 0) {
      toast.error("Please enter quantity");
      return;
    }

    await handleCreateOrder(
      positionType,
      quantity,
      leverage
    );
  };
  const entryPrice = positionType === "long"? marketPrice?.ask ?? 0: marketPrice?.bid ?? 0

  const postionSize = quantity ? (Number(quantity) * entryPrice).toFixed(2) : 0.00;

  const estimatedMargin =
  quantity? (
        (Number(quantity) * entryPrice) /
        leverage
      ).toFixed(2)
    : "0.00";

  return (
    <div className="w-full h-full border-l">
      <div className="h-16 border-b px-4 flex items-center">
        Market Order
      </div>

      <div className="p-4 space-y-6">

        <Tabs
          defaultValue="long"
          value={positionType}
          onValueChange={(value) =>
            setPositionType(
              value as "long" | "short"
            )
          }
        >
          <TabsList className="grid grid-cols-2 w-full h-12 ">
            <TabsTrigger value="long" className="cursor-pointer transsition-all duration-200 hover:text-emerald-600 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-semibold ">
              BUY / LONG
            </TabsTrigger>

            <TabsTrigger value="short" className="cursor-pointer transition-all duration-200 hover:text-rose-600 data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:font-semibold">
              SELL / SHORT
            </TabsTrigger>
          </TabsList>
        </Tabs>

    
        <div className=" rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-sm">
              Quantity
            </p>

            <Input
              className="outline-none"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              Leverage
            </p>

            <Select
              value={String(leverage)}
              onValueChange={(value) =>
                setLeverage(Number(value))}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select leverage" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="1">
                  1x
                </SelectItem>

                <SelectItem value="2">
                  2x
                </SelectItem>

                <SelectItem value="5">
                  5x
                </SelectItem>

                <SelectItem value="10">
                  10x
                </SelectItem>

                <SelectItem value="25">
                  25x
                </SelectItem>

                <SelectItem value="50">
                  50x
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-sm font-semibold">
            Position Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-sm">
                Entry Price
              </p>

              <p className="text-sm font-medium">
                 ${entryPrice.toLocaleString()}
              </p>
            </div>

             <div className="flex justify-between">
                <p className="text-sm">
                  Execution Type
                </p>

                <p className="text-sm font-medium">
                  {positionType === "long"
                    ? "Ask"
                    : "Bid"}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-sm">
                  Position Size
                </p>

                <p className="text-sm font-medium">
                  ${postionSize}
                </p>
              </div>

              <div className=" flex justify-between">
                <p className="text-sm">
                  Estimated Margin
                </p>

                <p className="text-lg">
                  ${estimatedMargin}
                </p>
              </div>
            </div>
          </div>
       
          <Button
            size="lg"
            className="w-full cursor-pointer "
            onClick={handlePlaceOrder}
            disabled={createOrderLoading}
          >
            {createOrderLoading
              ? "Creating Order..."
              : `PLACE ${positionType.toUpperCase()} ORDER`}
          </Button>
      </div>
    </div>
  );
}