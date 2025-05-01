import mongoose, { Document, Schema } from 'mongoose';
import { AlgorithmCategory, AlgorithmDifficulty } from './Algorithm';

// Learning path types
export enum LearningPathType {
  STANDARD = 'standard',
  CUSTOM = 'custom',
  RECOMMENDED = 'recommended'
}

// Learning path interface
export interface ILearningPath extends Document {
  name: string;
  description: string;
  slug: string;
  type: LearningPathType;
  category: AlgorithmCategory;
  difficulty: AlgorithmDifficulty;
  algorithms: {
    algorithm: mongoose.Types.ObjectId;
    order: number;
    requiredToAdvance: boolean;
  }[];
  prerequisites: mongoose.Types.ObjectId[];
  estimatedHours: number;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  userCount: number;
  completionRate: number;
}

// Create learning path schema
const learningPathSchema = new Schema<ILearningPath>(
  {
    name: {
      type: String,
      required: [true, 'Learning path name is required'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Learning path description is required']
    },
    slug: {
      type: String,
      required: [true, 'Learning path slug is required'],
      lowercase: true,
      unique: true,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(LearningPathType),
      default: LearningPathType.STANDARD
    },
    category: {
      type: String,
      enum: Object.values(AlgorithmCategory),
      required: [true, 'Learning path category is required']
    },
    difficulty: {
      type: String,
      enum: Object.values(AlgorithmDifficulty),
      required: [true, 'Learning path difficulty is required']
    },
    algorithms: [
      {
        algorithm: {
          type: Schema.Types.ObjectId,
          ref: 'Algorithm',
          required: true
        },
        order: {
          type: Number,
          required: true
        },
        requiredToAdvance: {
          type: Boolean,
          default: true
        }
      }
    ],
    prerequisites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Algorithm'
      }
    ],
    estimatedHours: {
      type: Number,
      required: true
    },
    tags: [String],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    userCount: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add auto-generated slug from name
learningPathSchema.pre<ILearningPath>('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for users currently on this learning path
learningPathSchema.virtual('activeUsers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'progress.currentLearningPath',
  justOne: false
});

// Index for better search performance
learningPathSchema.index({ name: 'text', description: 'text' });
learningPathSchema.index({ slug: 1 });
learningPathSchema.index({ category: 1 });
learningPathSchema.index({ difficulty: 1 });
learningPathSchema.index({ tags: 1 });

// Create and export LearningPath model
const LearningPath = mongoose.model<ILearningPath>('LearningPath', learningPathSchema);

export default LearningPath;