import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected');

        const email = 'admin@email.com';
        const password = 'admin123';

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = await User.create({
            fullName: 'System Admin',
            email: email,
            password: hashedPassword,
            role: 'admin',
            phone: '0770000000',
            birthday: new Date('1990-01-01')
        });

        console.log('Admin user created successfully:', adminUser.email);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin user:', err);
        process.exit(1);
    }
};

seedAdmin();
