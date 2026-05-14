"use client";



import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  symbol: string;
  side: "long" | "short";
  leverage: number;
  qty: number;
  status: "open" | "closed";
  pnl?: number | null;
  closedAt?: string | null;
};

type Props = {
  openOrders: Order[];
  closedOrders: Order[];
  handleCloseOrder: (
    orderId: string
  ) => Promise<void>;
  message: string;
  isLoading: boolean;
};
export default function OrdersSection({
  openOrders,
  closedOrders,
  handleCloseOrder,
  message,
  isLoading,
}: Props) {


  return (
    <div className="w-full h-full border-t p-4">

      {message && (
        <p className="mb-4 text-sm">
          {message}
        </p>
      )}

      <Tabs defaultValue="open">


        <TabsList>
          <TabsTrigger value="open">
            Open Orders
          </TabsTrigger>

          <TabsTrigger value="closed">
            Closed Orders
          </TabsTrigger>
        </TabsList>


        <TabsContent value="open">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Leverage</TableHead>
                <TableHead>Status</TableHead>
               
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {openOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    No open orders
                  </TableCell>
                </TableRow>
              ) : (
                openOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order.symbol}
                    </TableCell>

                    <TableCell>
                      {order.side}
                    </TableCell>

                    <TableCell>
                      {order.qty}
                    </TableCell>

                    <TableCell>
                      {order.leverage}x
                    </TableCell>

                    <TableCell>
                      {order.status}
                    </TableCell>

                    <TableCell>
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        onClick={() =>
                          handleCloseOrder(
                            order.id
                          )
                        }
                        disabled={isLoading}
                      >
                        Close
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="closed">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Leverage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Final PnL</TableHead>
                <TableHead>Closed At</TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>
              {closedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    No closed orders
                  </TableCell>
                </TableRow>
              ) : (
                closedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order.symbol}
                    </TableCell>

                    <TableCell>
                      {order.side}
                    </TableCell>

                    <TableCell>
                      {order.qty}
                    </TableCell>

                    <TableCell>
                      {order.leverage}x
                    </TableCell>

                    <TableCell>
                      {order.status}
                    </TableCell>

                    <TableCell>
                      {order.pnl ?? "--"}
                    </TableCell>

                    <TableCell>
                      {order.closedAt ?? "--"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>

      </Tabs>
    </div>
  );
}