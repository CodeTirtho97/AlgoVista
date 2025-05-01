import mongoose, { Document, Schema } from 'mongoose';

// Status of algorithm progress
export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  MASTERED = 'mastered'
}

// Interface for user progress
export interface IUserProgress extends Document {
  user: mongoose.Types.ObjectId;
  algorithm: mongoose.Types.ObjectId;
  status: ProgressStatus;
  completedSteps: number;
  totalSteps: number;
  attempts: number;
  lastAttemptDate: Date;
  timeSpent: number; // in seconds
  notes: string;
  ratings: {
    difficulty: number; // 1-5 rating
    understanding: number; // 1-5 rating
    visualization: number; // 1-5 rating
  };
  achievements: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create user progress schema
const userProgressSchema = new Schema<IUserProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    algorithm: {
      type: Schema.Types.ObjectId,
      ref: 'Algorithm',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ProgressStatus),
      default: ProgressStatus.NOT_STARTED
    },
    completedSteps: {
      type: Number,
      default: 0
    },
    totalSteps: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttemptDate: {
      type: Date
    },
    timeSpent: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ''
    },
    ratings: {
      difficulty: {
        type: Number,
        min: 1,
        max: 5
      },
      understanding: {
        type: Number,
        min: 1,
        max: 5
      },
      visualization: {
        type: Number,
        min: 1,
        max: 5
      }
    },
    achievements: [{
      type: Schema.Types.ObjectId,
      ref: 'Achievement'
    }]
  },
  {
    timestamps: true
  }
);

// Compound index to ensure a user has only one progress record per algorithm
userProgressSchema.index({ user: 1, algorithm: 1 }, { unique: true });

// Method to update progress status based on completed steps
userProgressSchema.methods.updateStatus = function(): void {
  const progress = this as IUserProgress;
  
  if (progress.completedSteps === 0) {
    progress.status = ProgressStatus.NOT_STARTED;
  } else if (progress.completedSteps < progress.totalSteps) {
    progress.status = ProgressStatus.IN_PROGRESS;
  } else if (progress.completedSteps >= progress.totalSteps) {
    // Consider it mastered if completed multiple times
    progress.status = progress.attempts > 3 ? ProgressStatus.MASTERED : ProgressStatus.COMPLETED;
  }
};

// Virtual property for calculating completion percentage
userProgressSchema.virtual('completionPercentage').get(function() {
  const progress = this as IUserProgress;
  if (progress.totalSteps === 0) return 0;
  return Math.round((progress.completedSteps / progress.totalSteps) * 100);
});

// Create and export UserProgress model
const UserProgress = mongoose.model<IUserProgress>('UserProgress', userProgressSchema);

export default UserProgress;