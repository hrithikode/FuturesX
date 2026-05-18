"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell,TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { formatDistanceToNow } from "date-fns"


type Props = {
  openOrders: Order[];
  closedOrders: Order[];
  handleCloseOrder: ( orderId: string) => Promise<void>;
  loadingOrderId: string | null;
};

export default function OrdersSection({
  openOrders,
  closedOrders,
  handleCloseOrder,
  loadingOrderId
}: Props) {

  return (
    <div className="w-full h-full border-t p-4">

      <Tabs defaultValue="open">

        <TabsList>
          <TabsTrigger value="open" className="cursor-pointer">
            Open Orders
          </TabsTrigger>

          <TabsTrigger value="closed" className="cursor-pointer">
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
                <TableHead>Margin</TableHead>
                <TableHead>Opening Price</TableHead>
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
                      ${(order.margin).toLocaleString("en-US")}
                    </TableCell>

                    <TableCell>
                      ${(order.openingPrice).toLocaleString("en-US")}
                    </TableCell>

                    <TableCell>
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        onClick={() =>handleCloseOrder(order.id)}
                        disabled={loadingOrderId === order.id}
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
                <TableHead>Margin</TableHead>
                <TableHead>Opening Price</TableHead>
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
                      ${(order.margin).toLocaleString("en-US")}
                    </TableCell>

                    <TableCell>
                      ${(order.openingPrice).toLocaleString("en-US")}
                    </TableCell>

                    <TableCell>
                      ${(order.pnl)?.toLocaleString("en-US") ?? "--"}
                    </TableCell>

                    <TableCell>
                      {order.closedAt 
                        ? formatDistanceToNow(
                            new Date(order.closedAt), 
                            { addSuffix: true }
                          ) : "-"}
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