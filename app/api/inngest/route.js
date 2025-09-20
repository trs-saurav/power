import { serve } from "inngest/next";
import { 
  inngest,
  createUserOrder,
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
  handleOrderStatusUpdate,
  handleOrderCancellation,
} from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // User management functions
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
    
    // Order management functions
    createUserOrder,
    handleOrderStatusUpdate,
    handleOrderCancellation,

  ],
});
