import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { AppError } from '../middleware/errorHandler';

/**
 * User registration controller
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, username, firstName, lastName } = req.body;
    
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(new AppError('Email already in use', 400));
    }
    
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(new AppError('Username already in use', 400));
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
    
    // Generate authentication token
    const token = user.generateAuthToken();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: userResponse
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User login controller
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }
    
    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Generate authentication token
    const token = user.generateAuthToken();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: userResponse
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // User is attached to request by authenticate middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, firstName, lastName } = req.body;
    
    // Check if email is being changed
    if (email && email !== req.user.email) {
      // Check if new email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return next(new AppError('Email already in use', 400));
      }
    }
    
    // Check if username is being changed
    if (username && username !== req.user.username) {
      // Check if new username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return next(new AppError('Username already in use', 400));
      }
    }
    
    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        email: email || req.user.email,
        username: username || req.user.username,
        firstName: firstName !== undefined ? firstName : req.user.firstName,
        lastName: lastName !== undefined ? lastName : req.user.lastName
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change user password
 */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return next(new AppError('Please provide current and new password', 400));
    }
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return next(new AppError('Current password is incorrect', 401));
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user settings
 */
export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { theme, codeEditorSettings } = req.body;
    
    // Prepare update object
    const updateObject: any = {};
    
    if (theme) {
      updateObject['settings.theme'] = theme;
    }
    
    if (codeEditorSettings) {
      if (codeEditorSettings.fontSize) {
        updateObject['settings.codeEditorSettings.fontSize'] = codeEditorSettings.fontSize;
      }
      
      if (codeEditorSettings.tabSize) {
        updateObject['settings.codeEditorSettings.tabSize'] = codeEditorSettings.tabSize;
      }
      
      if (codeEditorSettings.language) {
        updateObject['settings.codeEditorSettings.language'] = codeEditorSettings.language;
      }
    }
    
    // Update user settings
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateObject },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        settings: updatedUser?.settings
      }
    });
  } catch (error) {
    next(error);
  }
};