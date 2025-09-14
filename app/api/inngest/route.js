import { serve } from "inngest/next";
import { inngest } from "@/config/inngest"; // This should export the Inngest client instance
import {
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
} from "@/config/inngest"; // Adjust path if needed

export const { GET, POST , PUT} = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
  ],
});