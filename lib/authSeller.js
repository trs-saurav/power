import User from '@/models/user';
import connectDB from '@/config/db';

const authSeller = async (email) => {
    try {
        await connectDB();
        
        const user = await User.findById(email);
        
        if (user && user.role === 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Auth seller error:', error);
        return false;
    }
}

export default authSeller;