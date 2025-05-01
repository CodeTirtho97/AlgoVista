import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';

// Define user roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

// Define user document interface
export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  algorithms: mongoose.Types.ObjectId[];
  progress: {
    completedAlgorithms: mongoose.Types.ObjectId[];
    currentLearningPath?: mongoose.Types.ObjectId;
    achievements: mongoose.Types.ObjectId[];
  };
  settings: {
    theme: string;
    codeEditorSettings: {
      fontSize: number;
      tabSize: number;
      language: string;
    };
  };
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Create user schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Don't include password in queries by default
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username must be at most 20 characters long']
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },
    lastLogin: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    algorithms: [{
      type: Schema.Types.ObjectId,
      ref: 'Algorithm'
    }],
    progress: {
      completedAlgorithms: [{
        type: Schema.Types.ObjectId,
        ref: 'Algorithm'
      }],
      currentLearningPath: {
        type: Schema.Types.ObjectId,
        ref: 'LearningPath'
      },
      achievements: [{
        type: Schema.Types.ObjectId,
        ref: 'Achievement'
      }]
    },
    settings: {
      theme: {
        type: String,
        default: 'light'
      },
      codeEditorSettings: {
        fontSize: {
          type: Number,
          default: 14
        },
        tabSize: {
          type: Number,
          default: 2
        },
        language: {
          type: String,
          default: 'javascript'
        }
      }
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // Remove password from JSON output
        return ret;
      }
    }
  }
);

// Pre-save middleware to hash password
userSchema.pre<IUser>('save', async function (next) {
  const user = this;
  
  // Only hash password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  
  try {
    // Generate salt and hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    
    // Replace plain password with hashed one
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    // Need to select password explicitly as it's excluded by default
    const user = this as IUser;
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  const user = this as IUser;
  
  // Create token payload
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role
  };
  
  // Sign and return token
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
};

// Create and export User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;