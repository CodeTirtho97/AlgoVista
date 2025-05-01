import mongoose, { Document, Schema } from 'mongoose';

// Achievement categories
export enum AchievementCategory {
  LEARNING = 'learning',
  MASTERY = 'mastery',
  PARTICIPATION = 'participation',
  CHALLENGE = 'challenge',
  SPECIAL = 'special'
}

// Achievement interface
export interface IAchievement extends Document {
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  points: number;
  criteria: {
    type: string;
    value: number;
    algorithmId?: mongoose.Types.ObjectId;
    categoryId?: string;
  };
  isSecret: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create achievement schema
const achievementSchema = new Schema<IAchievement>(
  {
    name: {
      type: String,
      required: [true, 'Achievement name is required'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Achievement description is required']
    },
    icon: {
      type: String,
      required: [true, 'Achievement icon is required']
    },
    category: {
      type: String,
      enum: Object.values(AchievementCategory),
      required: [true, 'Achievement category is required']
    },
    points: {
      type: Number,
      required: [true, 'Achievement points are required'],
      min: 0
    },
    criteria: {
      type: {
        type: String,
        required: [true, 'Criteria type is required'],
        enum: [
          'algorithms_completed',
          'algorithms_mastered',
          'specific_algorithm_completed',
          'category_completed',
          'time_spent',
          'consecutive_days',
          'challenges_completed',
          'perfect_score',
          'custom'
        ]
      },
      value: {
        type: Number,
        required: [true, 'Criteria value is required']
      },
      algorithmId: {
        type: Schema.Types.ObjectId,
        ref: 'Algorithm'
      },
      categoryId: {
        type: String
      }
    },
    isSecret: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create and export Achievement model
const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);

export default Achievement;