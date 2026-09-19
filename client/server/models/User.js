import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a full name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Don't return password by default
    },
    // 🛡️ Admin සහ Normal User වෙන් කර හඳුනා ගැනීමට එකතු කළ කොටස
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' // සාමාන්‍යයෙන් Register වෙන හැමෝම මුලින්ම 'user' කෙනෙක් වෙනවා
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;