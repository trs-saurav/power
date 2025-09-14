
import { Inngest } from "inngest";
import connectDB from "./db";

export const inngest = new Inngest({ id: "power-electronics" });

// Ingest function to save user data to the database

export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { 
        event: 'clerk/user.created'
    },

    async ({event}) => {
        const {id , first_name , last_name , email_address, image_url} = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url
        }
        await connectDB();
        await User.create(userData);
    }
)


//ingest function to update user data in the database

export const syncUserUpdate = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },

    async ({event}) => {
        const {id , first_name , last_name , email_address, image_url} = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url
        }
        await connectDB();
        await User.findByIdAndUpdate(id, userData);
    }


)

//ingest function to delete user data from the database

export const syncUserDeletion = inngest.createFunction( 
    {
        id: 'delete-user-from-clerk'
    },
    {
        event: 'clerk/user.deleted'
    },

    async ({event}) => {
        const {id} = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)
