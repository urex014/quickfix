// lib/models/Issue.ts
import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    venue: {
      type: String,
      required: [true, 'Please specify the venue or location'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the issue'],
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Reported', 'Working On', 'Resolved'],
      default: 'Reported',
    },
    imageUrl: {
      type: String, // This will be the URL after we upload the picture to cloud storage
      default: null,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links this issue to the user who reported it
      required: true,
    },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt fields
);

const Issue = mongoose.models.Issue || mongoose.model('Issue', issueSchema);
export default Issue;