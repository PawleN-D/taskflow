import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  owner_id: mongoose.Types.ObjectId;
  created_at: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

export const Workspace = mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);