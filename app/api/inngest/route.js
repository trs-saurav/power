import { serve } from "inngest/next";
import { inngest, syncUserCreation, syncUserUpdate, syncUserDeletion, createOrder, processOrderCreated, handleOrderStatusUpdate, handleOrderCancellation } from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate, 
    syncUserDeletion,
    createOrder,
    processOrderCreated,
    handleOrderStatusUpdate,
    handleOrderCancellation
  ],
});
