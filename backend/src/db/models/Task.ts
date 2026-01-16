import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  workspace_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  assigned_to?: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    workspace_id: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
    },
    assigned_to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);