import { Algorithm, IAlgorithm, AlgorithmCategory, AlgorithmDifficulty, ProgrammingLanguage } from '../models';

export interface AlgorithmFilters {
  categories?: AlgorithmCategory[];
  difficulties?: AlgorithmDifficulty[];
  languages?: ProgrammingLanguage[];
  searchTerm?: string;
  createdById?: string;
}

export class AlgorithmLibraryService {
  /**
   * Get algorithm by ID
   */
  public async getAlgorithmById(id: string): Promise<IAlgorithm> {
    const algorithm = await Algorithm.findById(id)
      .populate('createdBy', 'username email')
      .populate('relatedAlgorithms');
    
    if (!algorithm) {
      throw new Error('Algorithm not found');
    }
    
    return algorithm;
  }
  
  /**
   * Get algorithm by slug
   */
  public async getAlgorithmBySlug(slug: string): Promise<IAlgorithm> {
    const algorithm = await Algorithm.findOne({ slug })
      .populate('createdBy', 'username email')
      .populate('relatedAlgorithms');
    
    if (!algorithm) {
      throw new Error('Algorithm not found');
    }
    
    return algorithm;
  }
  
  /**
   * Get algorithms with filters
   */
  public async getAlgorithms(
    filters?: AlgorithmFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<IAlgorithm[]> {
    const query: any = {};
    
    // Apply filters
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        query.category = { $in: filters.categories };
      }
      
      if (filters.difficulties && filters.difficulties.length > 0) {
        query.difficulty = { $in: filters.difficulties };
      }
      
      if (filters.languages && filters.languages.length > 0) {
        query['implementations.language'] = { $in: filters.languages };
      }
      
      if (filters.searchTerm) {
        query.$text = { $search: filters.searchTerm };
      }
      
      if (filters.createdById) {
        query.createdBy = filters.createdById;
      }
    }
    
    // Default to published algorithms only
    if (!query.createdBy) {
      query.isPublished = true;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Execute query
    const algorithms = await Algorithm.find(query)
      .populate('createdBy', 'username email')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    return algorithms;
  }
  
  /**
   * Count algorithms with filters
   */
  public async countAlgorithms(filters?: AlgorithmFilters): Promise<number> {
    const query: any = {};
    
    // Apply filters
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        query.category = { $in: filters.categories };
      }
      
      if (filters.difficulties && filters.difficulties.length > 0) {
        query.difficulty = { $in: filters.difficulties };
      }
      
      if (filters.languages && filters.languages.length > 0) {
        query['implementations.language'] = { $in: filters.languages };
      }
      
      if (filters.searchTerm) {
        query.$text = { $search: filters.searchTerm };
      }
      
      if (filters.createdById) {
        query.createdBy = filters.createdById;
      }
    }
    
    // Default to published algorithms only
    if (!query.createdBy) {
      query.isPublished = true;
    }
    
    // Count matching documents
    return await Algorithm.countDocuments(query);
  }
  
  /**
   * Create a new algorithm
   */
  public async createAlgorithm(
    userId: string,
    data: {
      name: string;
      description: string;
      category: AlgorithmCategory;
      difficulty: AlgorithmDifficulty;
      implementations: {
        language: ProgrammingLanguage;
        code: string;
        defaultDataset: string;
        timeComplexity: string;
        spaceComplexity: string;
      }[];
      examples: {
        input: string;
        output: string;
        explanation?: string;
      }[];
      applications: string[];
      resources: {
        title: string;
        url: string;
        type: string;
      }[];
      relatedAlgorithmIds?: string[];
      isPublished: boolean;
    }
  ): Promise<IAlgorithm> {
    // Create algorithm object
    const algorithm = new Algorithm({
      name: data.name,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      implementations: data.implementations,
      examples: data.examples,
      applications: data.applications,
      resources: data.resources,
      createdBy: userId,
      isPublished: data.isPublished
    });
    
    // Add related algorithms if provided
    if (data.relatedAlgorithmIds && data.relatedAlgorithmIds.length > 0) {
      algorithm.relatedAlgorithms = data.relatedAlgorithmIds;
    }
    
    // Save to database
    await algorithm.save();
    
    return algorithm;
  }
  
  /**
   * Update an existing algorithm
   */
  public async updateAlgorithm(
    userId: string,
    algorithmId: string,
    data: {
      name?: string;
      description?: string;
      category?: AlgorithmCategory;
      difficulty?: AlgorithmDifficulty;
      implementations?: {
        language: ProgrammingLanguage;
        code: string;
        defaultDataset: string;
        timeComplexity: string;
        spaceComplexity: string;
      }[];
      examples?: {
        input: string;
        output: string;
        explanation?: string;
      }[];
      applications?: string[];
      resources?: {
        title: string;
        url: string;
        type: string;
      }[];
      relatedAlgorithmIds?: string[];
      isPublished?: boolean;
    }
  ): Promise<IAlgorithm> {
    // Get existing algorithm
    const algorithm = await Algorithm.findById(algorithmId);
    
    if (!algorithm) {
      throw new Error('Algorithm not found');
    }
    
    // Check if user is the creator or an admin
    if (algorithm.createdBy.toString() !== userId) {
      throw new Error('Not authorized to update this algorithm');
    }
    
    // Update fields
    if (data.name) algorithm.name = data.name;
    if (data.description) algorithm.description = data.description;
    if (data.category) algorithm.category = data.category;
    if (data.difficulty) algorithm.difficulty = data.difficulty;
    if (data.implementations) algorithm.implementations = data.implementations;
    if (data.examples) algorithm.examples = data.examples;
    if (data.applications) algorithm.applications = data.applications;
    if (data.resources) algorithm.resources = data.resources;
    if (data.isPublished !== undefined) algorithm.isPublished = data.isPublished;
    
    // Update related algorithms if provided
    if (data.relatedAlgorithmIds) {
      algorithm.relatedAlgorithms = data.relatedAlgorithmIds;
    }
    
    // Save changes
    await algorithm.save();
    
    return algorithm;
  }
  
  /**
   * Delete an algorithm
   */
  public async deleteAlgorithm(userId: string, algorithmId: string): Promise<boolean> {
    // Get existing algorithm
    const algorithm = await Algorithm.findById(algorithmId);
    
    if (!algorithm) {
      throw new Error('Algorithm not found');
    }
    
    // Check if user is the creator or an admin
    if (algorithm.createdBy.toString() !== userId) {
      throw new Error('Not authorized to delete this algorithm');
    }
    
    // Delete algorithm
    await Algorithm.findByIdAndDelete(algorithmId);
    
    return true;
  }
  
  /**
   * Get related algorithms
   */
  public async getRelatedAlgorithms(algorithmId: string, limit: number = 5): Promise<IAlgorithm[]> {
    // Get algorithm to find its related algorithms
    const algorithm = await Algorithm.findById(algorithmId)
      .populate('relatedAlgorithms');
    
    if (!algorithm) {
      throw new Error('Algorithm not found');
    }
    
    const relatedIds = algorithm.relatedAlgorithms.map(a => a._id);
    
    // If we have enough explicitly defined related algorithms, return them
    if (relatedIds.length >= limit) {
      return algorithm.relatedAlgorithms.slice(0, limit);
    }
    
    // Otherwise, find algorithms in the same category
    const remainingLimit = limit - relatedIds.length;
    
    const additionalAlgorithms = await Algorithm.find({
      _id: { $ne: algorithmId, $nin: relatedIds },
      category: algorithm.category,
      isPublished: true
    })
      .limit(remainingLimit);
    
    return [...algorithm.relatedAlgorithms, ...additionalAlgorithms];
  }
  
  /**
   * Get popular algorithms
   */
  public async getPopularAlgorithms(limit: number = 10): Promise<IAlgorithm[]> {
    // This would require adding a popularity field or calculating it
    // For now, we'll return recently added algorithms
    return await Algorithm.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
  
  /**
   * Get algorithm categories with counts
   */
  public async getCategories(): Promise<{ category: AlgorithmCategory; count: number }[]> {
    const categories = await Algorithm.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    
    return categories;
  }
  
  /**
   * Get algorithm difficulties with counts
   */
  public async getDifficulties(): Promise<{ difficulty: AlgorithmDifficulty; count: number }[]> {
    const difficulties = await Algorithm.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $project: { difficulty: '$_id', count: 1, _id: 0 } },
      { $sort: { difficulty: 1 } }
    ]);
    
    return difficulties;
  }
}

// Export singleton instance
const algorithmLibraryService = new AlgorithmLibraryService();
export default algorithmLibraryService;