import { Request, Response, NextFunction } from 'express';
import { Algorithm } from '../models';
import { algorithmLibraryService, algorithmExecutionService } from '../services';
import { AppError } from '../middleware/errorHandler';

/**
 * Get all algorithms
 */
export const getAllAlgorithms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Build filters from query parameters
    const filters: any = {};
    
    if (req.query.category) {
      filters.categories = [req.query.category as string];
    }
    
    if (req.query.difficulty) {
      filters.difficulties = [req.query.difficulty as string];
    }
    
    if (req.query.search) {
      filters.searchTerm = req.query.search as string;
    }
    
    // Get algorithms with pagination
    const algorithms = await algorithmLibraryService.getAlgorithms(filters, page, limit);
    const total = await algorithmLibraryService.countAlgorithms(filters);
    
    res.status(200).json({
      status: 'success',
      results: algorithms.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total
      },
      data: {
        algorithms
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get algorithm by ID
 */
export const getAlgorithm = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const algorithm = await algorithmLibraryService.getAlgorithmById(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        algorithm
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new algorithm
 */
export const createAlgorithm = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      difficulty,
      implementations,
      examples,
      applications,
      resources,
      relatedAlgorithmIds,
      isPublished
    } = req.body;
    
    // Create algorithm
    const algorithm = await algorithmLibraryService.createAlgorithm(
      req.user.id,
      {
        name,
        description,
        category,
        difficulty,
        implementations,
        examples,
        applications,
        resources,
        relatedAlgorithmIds,
        isPublished
      }
    );
    
    res.status(201).json({
      status: 'success',
      data: {
        algorithm
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update algorithm
 */
export const updateAlgorithm = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      difficulty,
      implementations,
      examples,
      applications,
      resources,
      relatedAlgorithmIds,
      isPublished
    } = req.body;
    
    // Update algorithm
    const algorithm = await algorithmLibraryService.updateAlgorithm(
      req.user.id,
      id,
      {
        name,
        description,
        category,
        difficulty,
        implementations,
        examples,
        applications,
        resources,
        relatedAlgorithmIds,
        isPublished
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        algorithm
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete algorithm
 */
export const deleteAlgorithm = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    await algorithmLibraryService.deleteAlgorithm(req.user.id, id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Execute algorithm
 */
export const executeAlgorithm = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { language, input, customCode } = req.body;
    
    // Get algorithm if custom code is not provided
    let code = customCode;
    
    if (!code) {
      const algorithm = await Algorithm.findById(id);
      
      if (!algorithm) {
        return next(new AppError('Algorithm not found', 404));
      }
      
      // Find implementation for the specified language
      const implementation = algorithm.implementations.find(impl => impl.language === language);
      
      if (!implementation) {
        return next(new AppError(`Implementation for ${language} not found`, 404));
      }
      
      code = implementation.code;
    }
    
    // Execute algorithm
    const result = await algorithmExecutionService.executeAlgorithm(
      language,
      code,
      input
    );
    
    if (result.error) {
      return next(new AppError(`Execution error: ${result.error}`, 400));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        executionId: result.executionId,
        result: result.result
      }
    });
  } catch (error) {
    next(error);
  }
};