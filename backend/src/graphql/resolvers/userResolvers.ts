import { IResolvers } from '@graphql-tools/utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../models';
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server-express';
import { Context } from '../../types/context';
import { getUserFromToken } from '../../utils/auth';
import config from '../../config';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface UpdateUserInput {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

interface UpdateUserSettingsInput {
  theme?: string;
  codeEditorSettings?: {
    fontSize?: number;
    tabSize?: number;
    language?: string;
  };
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

const userResolvers: IResolvers = {
  Query: {
    // Get current user
    me: async (_: any, __: any, { token }: Context) => {
      const user = await getUserFromToken(token);
      return user;
    },
    
    // Get user by ID
    user: async (_: any, { id }: { id: string }, { token }: Context) => {
      const currentUser = await getUserFromToken(token);
      
      // Only allow admins or the user themselves to access user data
      if (currentUser.role !== 'admin' && currentUser.id !== id) {
        throw new ForbiddenError('Not authorized to access this user data');
      }
      
      const user = await User.findById(id);
      if (!user) {
        throw new UserInputError('User not found');
      }
      
      return user;
    },
    
    // Get all users (admin only)
    users: async (_: any, __: any, { token }: Context) => {
      const currentUser = await getUserFromToken(token);
      
      // Only allow admins to list all users
      if (currentUser.role !== 'admin') {
        throw new ForbiddenError('Not authorized to access user list');
      }
      
      return await User.find();
    }
  },
  
  Mutation: {
    // User login
    login: async (_: any, { input }: { input: LoginInput }) => {
      const { email, password } = input;
      
      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }
      
      // Update last login time
      user.lastLogin = new Date();
      await user.save();
      
      // Generate token
      const token = user.generateAuthToken();
      
      return {
        token,
        user
      };
    },
    
    // User registration
    register: async (_: any, { input }: { input: RegisterInput }) => {
      const { email, password, username, firstName, lastName } = input;
      
      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        throw new UserInputError('Email already in use');
      }
      
      // Check if username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        throw new UserInputError('Username already in use');
      }
      
      // Create new user
      const user = new User({
        email,
        password,
        username,
        firstName,
        lastName
      });
      
      await user.save();
      
      // Generate token
      const token = user.generateAuthToken();
      
      return {
        token,
        user
      };
    },
    
    // Update user profile
    updateUser: async (_: any, { input }: { input: UpdateUserInput }, { token }: Context) => {
      const currentUser = await getUserFromToken(token);
      
      // Check for email uniqueness if changing email
      if (input.email && input.email !== currentUser.email) {
        const existingEmail = await User.findOne({ email: input.email });
        if (existingEmail) {
          throw new UserInputError('Email already in use');
        }
      }
      
      // Check for username uniqueness if changing username
      if (input.username && input.username !== currentUser.username) {
        const existingUsername = await User.findOne({ username: input.username });
        if (existingUsername) {
          throw new UserInputError('Username already in use');
        }
      }
      
      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        currentUser.id,
        { $set: input },
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }
      
      return updatedUser;
    },
    
    // Update user settings
    updateUserSettings: async (_: any, { input }: { input: UpdateUserSettingsInput }, { token }: Context) => {
      const currentUser = await getUserFromToken(token);
      
      // Prepare update object
      const updateObject: any = {};
      
      if (input.theme) {
        updateObject['settings.theme'] = input.theme;
      }
      
      if (input.codeEditorSettings) {
        if (input.codeEditorSettings.fontSize) {
          updateObject['settings.codeEditorSettings.fontSize'] = input.codeEditorSettings.fontSize;
        }
        
        if (input.codeEditorSettings.tabSize) {
          updateObject['settings.codeEditorSettings.tabSize'] = input.codeEditorSettings.tabSize;
        }
        
        if (input.codeEditorSettings.language) {
          updateObject['settings.codeEditorSettings.language'] = input.codeEditorSettings.language;
        }
      }
      
      // Update user settings
      const updatedUser = await User.findByIdAndUpdate(
        currentUser.id,
        { $set: updateObject },
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        throw new Error('Failed to update user settings');
      }
      
      return updatedUser.settings;
    },
    
    // Change password
    changePassword: async (_: any, { input }: { input: ChangePasswordInput }, { token }: Context) => {
      const { currentPassword, newPassword } = input;
      const currentUser = await getUserFromToken(token);
      
      // Get user with password field
      const user = await User.findById(currentUser.id).select('+password');
      
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      
      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isPasswordValid) {
        throw new AuthenticationError('Current password is incorrect');
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      return true;
    },
    
    // Delete account
    deleteAccount: async (_: any, __: any, { token }: Context) => {
      const currentUser = await getUserFromToken(token);
      
      await User.findByIdAndDelete(currentUser.id);
      
      return true;
    }
  }
};

export default userResolvers;