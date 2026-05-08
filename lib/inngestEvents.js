import { inngest } from "@/config/inngest";

/**
 * Trigger user signup event
 * Call this in your NextAuth sign-up API endpoint
 */
export async function triggerUserSignup(userData) {
    try {
        await inngest.send({
            name: 'user/signup',
            data: {
                userId: userData.userId || userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                name: userData.name,
                imageUrl: userData.imageUrl
            }
        });
        console.log('✅ User signup event sent to Inngest');
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending user signup event:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Trigger user update event
 * Call this in your NextAuth profile update API endpoint
 */
export async function triggerUserUpdate(userData) {
    try {
        await inngest.send({
            name: 'user/update',
            data: {
                userId: userData.userId || userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                name: userData.name,
                imageUrl: userData.imageUrl
            }
        });
        console.log('✅ User update event sent to Inngest');
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending user update event:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Trigger user deletion event
 * Call this in your account deletion API endpoint
 */
export async function triggerUserDeletion(userId) {
    try {
        await inngest.send({
            name: 'user/delete',
            data: {
                userId: userId
            }
        });
        console.log('✅ User deletion event sent to Inngest');
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending user deletion event:', error);
        return { success: false, error: error.message };
    }
}
