import mongoose, { Document, Schema } from 'mongoose';

// Algorithm categories
export enum AlgorithmCategory {
  SORTING = 'sorting',
  SEARCHING = 'searching',
  GRAPH = 'graph',
  TREE = 'tree',
  DYNAMIC_PROGRAMMING = 'dynamic_programming',
  GREEDY = 'greedy',
  DIVIDE_AND_CONQUER = 'divide_and_conquer',
  BACKTRACKING = 'backtracking',
  STRING = 'string',
  DATA_STRUCTURE = 'data_structure',
  MISCELLANEOUS = 'miscellaneous'
}

// Algorithm difficulty levels
export enum AlgorithmDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

// Programming languages supported
export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp'
}

// Algorithm time complexity
export enum TimeComplexity {
  O_1 = 'O(1)',
  O_LOG_N = 'O(log n)',
  O_N = 'O(n)',
  O_N_LOG_N = 'O(n log n)',
  O_N_2 = 'O(n²)',
  O_N_3 = 'O(n³)',
  O_2_N = 'O(2^n)',
  O_N_FACTORIAL = 'O(n!)'
}

// Algorithm space complexity
export enum SpaceComplexity {
  O_1 = 'O(1)',
  O_LOG_N = 'O(log n)',
  O_N = 'O(n)',
  O_N_2 = 'O(n²)',
  O_N_3 = 'O(n³)',
  O_2_N = 'O(2^n)'
}

// Algorithm implementation interface
interface IAlgorithmImplementation {
  language: ProgrammingLanguage;
  code: string;
  defaultDataset: string;
  timeComplexity: TimeComplexity;
  spaceComplexity: SpaceComplexity;
}

// Algorithm interface
export interface IAlgorithm extends Document {
  name: string;
  slug: string;
  description: string;
  category: AlgorithmCategory;
  difficulty: AlgorithmDifficulty;
  implementations: IAlgorithmImplementation[];
  visualizations: {
    steps: mongoose.Types.ObjectId[];
    animationType: string;
    dataStructureType: string;
  };
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  applications: string[];
  resources: {
    title: string;
    url: string;
    type: string;
  }[];
  relatedAlgorithms: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create algorithm schema
const algorithmSchema = new Schema<IAlgorithm>(
  {
    name: {
      type: String,
      required: [true, 'Algorithm name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: [true, 'Algorithm slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Algorithm description is required']
    },
    category: {
      type: String,
      enum: Object.values(AlgorithmCategory),
      required: [true, 'Algorithm category is required']
    },
    difficulty: {
      type: String,
      enum: Object.values(AlgorithmDifficulty),
      required: [true, 'Algorithm difficulty is required']
    },
    implementations: [
      {
        language: {
          type: String,
          enum: Object.values(ProgrammingLanguage),
          required: [true, 'Programming language is required for implementation']
        },
        code: {
          type: String,
          required: [true, 'Code implementation is required']
        },
        defaultDataset: {
          type: String,
          required: [true, 'Default dataset is required for visualization']
        },
        timeComplexity: {
          type: String,
          enum: Object.values(TimeComplexity),
          required: [true, 'Time complexity analysis is required']
        },
        spaceComplexity: {
          type: String,
          enum: Object.values(SpaceComplexity),
          required: [true, 'Space complexity analysis is required']
        }
      }
    ],
    visualizations: {
      steps: [{
        type: Schema.Types.ObjectId,
        ref: 'VisualizationStep'
      }],
      animationType: {
        type: String,
        default: 'default'
      },
      dataStructureType: {
        type: String,
        required: [true, 'Data structure type is required for visualization']
      }
    },
    examples: [
      {
        input: {
          type: String,
          required: true
        },
        output: {
          type: String,
          required: true
        },
        explanation: {
          type: String
        }
      }
    ],
    applications: [String],
    resources: [
      {
        title: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        },
        type: {
          type: String,
          default: 'article'
        }
      }
    ],
    relatedAlgorithms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Algorithm'
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add auto-generated slug from name
algorithmSchema.pre<IAlgorithm>('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for progress statistics
algorithmSchema.virtual('stats', {
  ref: 'UserProgress',
  localField: '_id',
  foreignField: 'algorithm',
  justOne: false
});

// Index for better search performance
algorithmSchema.index({ name: 'text', description: 'text' });
algorithmSchema.index({ slug: 1 });
algorithmSchema.index({ category: 1 });
algorithmSchema.index({ difficulty: 1 });

// Create and export Algorithm model
const Algorithm = mongoose.model<IAlgorithm>('Algorithm', algorithmSchema);

export default Algorithm;