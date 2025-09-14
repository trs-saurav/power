import { Inngest } from "inngest";
import { fn } from "inngest/next";
import connectDB from "./db";
import User from "@/models/user";

// Initialize Inngest client
export const inngest = new Inngest({ id: "power-electronics" });

// Function: Create User
export const syncUserCreation = (
  "sync-user-from-clerk",
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);

// Function: Update User
export const syncUserUpdate = fn(
  "update-user-from-clerk",
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Function: Delete User
export const syncUserDeletion = fn(
  "delete-user-from-clerk",
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);