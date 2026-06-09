import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid university email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false, // Ensures password isn't accidentally queried and leaked
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      default: 'student',
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;