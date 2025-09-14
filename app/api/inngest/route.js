import { serve } from "inngest/next";

import { inngest } from "@/config/inngest.js";
import { syncUserCreation, syncUserDeletion, syncUserUpdate } from "@/config/inngest";

export const { GET, POST , PUT } = serve(inngest, {
    client: inngest,
    functions: [
        syncUserCreation ,
        syncUserUpdate,
        syncUserDeletion
    ]
});
    