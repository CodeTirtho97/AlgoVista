import mongoose from 'mongoose';
import { UserProgress, Algorithm, User, LearningPath, Achievement, IUserProgress } from '../models';
import { AlgorithmCategory, ProgressStatus } from '../models';

export class UserProgressService {
  /**
   * Get user progress for a specific algorithm
   */
  public async getUserProgress(userId: string, algorithmId: string): Promise<IUserProgress> {
    // Find existing progress or create new one
    let progress = await UserProgress.findOne({
      user: userId,
      algorithm: algorithmId
    });
    
    // If no progress exists, create a new entry
    if (!progress) {
      // Get algorithm to determine total steps
      const algorithm = await Algorithm.findById(algorithmId);
      
      if (!algorithm) {
        throw new Error('Algorithm not found');
      }
      
      // Create new progress entry
      progress = new UserProgress({
        user: userId,
        algorithm: algorithmId,
        status: ProgressStatus.NOT_STARTED,
        completedSteps: 0,
        totalSteps: algorithm.visualizations?.steps?.length || 0,
        attempts: 0,
        timeSpent: 0
      });
      
      await progress.save();
    }
    
    return progress;
  }
  
  /**
   * Get all progress records for a user
   */
  public async getUserProgressList(userId: string, status?: ProgressStatus): Promise<IUserProgress[]> {
    const query: any = { user: userId };
    
    if (status) {
      query.status = status;
    }
    
    return await UserProgress.find(query)
      .populate('algorithm')
      .populate('achievements')
      .sort({ updatedAt: -1 });
  }
  
  /**
   * Update user progress
   */
  public async updateProgress(
    userId: string,
    algorithmId: string,
    updates: {
      completedSteps?: number;
      totalSteps?: number;
      timeSpent?: number;
      notes?: string;
      ratings?: {
        difficulty?: number;
        understanding?: number;
        visualization?: number;
      };
    }
  ): Promise<IUserProgress> {
    // Get current progress or create new one
    let progress = await this.getUserProgress(userId, algorithmId);
    
    // Apply updates
    if (updates.completedSteps !== undefined) {
      progress.completedSteps = updates.completedSteps;
    }
    
    if (updates.totalSteps !== undefined) {
      progress.totalSteps = updates.totalSteps;
    }
    
    if (updates.timeSpent !== undefined) {
      progress.timeSpent += updates.timeSpent;
    }
    
    if (updates.notes !== undefined) {
      progress.notes = updates.notes;
    }
    
    if (updates.ratings) {
      progress.ratings = {
        ...progress.ratings,
        ...updates.ratings
      };
    }
    
    // Update status based on completed steps
    progress.updateStatus();
    
    // Save changes
    await progress.save();
    
    // Check for achievements
    await this.checkAchievements(userId, algorithmId);
    
    return progress;
  }
  
  /**
   * Record a new attempt at an algorithm
   */
  public async recordAttempt(userId: string, algorithmId: string): Promise<IUserProgress> {
    // Get current progress or create new one
    let progress = await this.getUserProgress(userId, algorithmId);
    
    // Update attempt count and date
    progress.attempts += 1;
    progress.lastAttemptDate = new Date();
    
    // Save changes
    await progress.save();
    
    return progress;
  }
  
  /**
   * Reset progress for an algorithm
   */
  public async resetProgress(userId: string, algorithmId: string): Promise<boolean> {
    // Find and update progress
    await UserProgress.findOneAndUpdate(
      { user: userId, algorithm: algorithmId },
      {
        completedSteps: 0,
        status: ProgressStatus.NOT_STARTED,
        timeSpent: 0,
        notes: '',
        ratings: {}
      }
    );
    
    return true;
  }
  
  /**
   * Add a note to algorithm progress
   */
  public async addProgressNote(userId: string, algorithmId: string, note: string): Promise<IUserProgress> {
    // Get current progress or create new one
    let progress = await this.getUserProgress(userId, algorithmId);
    
    // Update note
    progress.notes = note;
    
    // Save changes
    await progress.save();
    
    return progress;
  }
  
  /**
   * Rate an algorithm
   */
  public async rateAlgorithm(
    userId: string,
    algorithmId: string,
    ratings: {
      difficulty?: number;
      understanding?: number;
      visualization?: number;
    }
  ): Promise<IUserProgress> {
    // Get current progress or create new one
    let progress = await this.getUserProgress(userId, algorithmId);
    
    // Update ratings
    progress.ratings = {
      ...progress.ratings,
      ...ratings
    };
    
    // Save changes
    await progress.save();
    
    return progress;
  }
  
  /**
   * Get user progress statistics
   */
  public async getUserProgressStats(userId: string): Promise<{
    algorithmsStarted: number;
    algorithmsCompleted: number;
    algorithmsMastered: number;
    totalTimeSpent: number;
    averageCompletionRate: number;
    strongestCategory?: AlgorithmCategory;
    recommendedAlgorithms: any[];
  }> {
    // Get all user progress records
    const progressRecords = await UserProgress.find({ user: userId })
      .populate('algorithm');
    
    // Calculate basic stats
    const algorithmsStarted = progressRecords.filter(p => p.status !== ProgressStatus.NOT_STARTED).length;
    const algorithmsCompleted = progressRecords.filter(p => p.status === ProgressStatus.COMPLETED).length;
    const algorithmsMastered = progressRecords.filter(p => p.status === ProgressStatus.MASTERED).length;
    const totalTimeSpent = progressRecords.reduce((sum, record) => sum + record.timeSpent, 0);
    
    // Calculate average completion rate
    const completionRates = progressRecords.map(p => {
      if (p.totalSteps === 0) return 0;
      return (p.completedSteps / p.totalSteps) * 100;
    });
    
    const avgCompletionRate = completionRates.length > 0
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
      : 0;
    
    // Determine strongest category
    const categoryCompletionMap: Record<AlgorithmCategory, number> = {} as Record<AlgorithmCategory, number>;
    
    progressRecords.forEach(record => {
      const algorithm: any = record.algorithm;
      if (algorithm && algorithm.category) {
        const category = algorithm.category as AlgorithmCategory;
        if (!categoryCompletionMap[category]) {
          categoryCompletionMap[category] = 0;
        }
        
        // Only count completed or mastered algorithms
        if (record.status === ProgressStatus.COMPLETED || record.status === ProgressStatus.MASTERED) {
          categoryCompletionMap[category]++;
        }
      }
    });
    
    let strongestCategory: AlgorithmCategory | undefined;
    let maxCompleted = 0;
    
    Object.entries(categoryCompletionMap).forEach(([category, count]) => {
      if (count > maxCompleted) {
        maxCompleted = count;
        strongestCategory = category as AlgorithmCategory;
      }
    });
    
    // Get recommended algorithms
    const recommendedAlgorithms = await this.getRecommendedAlgorithms(userId);
    
    return {
      algorithmsStarted,
      algorithmsCompleted,
      algorithmsMastered,
      totalTimeSpent,
      averageCompletionRate: avgCompletionRate,
      strongestCategory,
      recommendedAlgorithms
    };
  }
  
  /**
   * Get recommended algorithms for a user
   */
  private async getRecommendedAlgorithms(userId: string, limit: number = 5): Promise<any[]> {
    // Get completed algorithm IDs
    const completedProgress = await UserProgress.find({
      user: userId,
      status: { $in: [ProgressStatus.COMPLETED, ProgressStatus.MASTERED] }
    });
    
    const completedAlgorithmIds = completedProgress.map(p => p.algorithm);
    
    // Get user's current learning path if any
    const user = await User.findById(userId);
    let learningPathId = user?.progress?.currentLearningPath;
    
    let recommendedAlgorithms: any[] = [];
    
    if (learningPathId) {
      // Recommend next algorithms in learning path
      const learningPath = await LearningPath.findById(learningPathId)
        .populate({
          path: 'algorithms.algorithm',
          model: 'Algorithm'
        });
      
      if (learningPath) {
        // Filter algorithms not yet completed, sorted by order
        const nextAlgorithms = learningPath.algorithms
          .filter(item => !completedAlgorithmIds.includes(item.algorithm._id))
          .sort((a, b) => a.order - b.order)
          .map(item => item.algorithm)
          .slice(0, limit);
        
        recommendedAlgorithms = nextAlgorithms;
      }
    }
    
    // If we don't have enough recommendations from the learning path
    if (recommendedAlgorithms.length < limit) {
      // Get algorithms in the user's strongest category
      const stats = await this.getUserProgressStats(userId);
      
      if (stats.strongestCategory) {
        // Find algorithms in the same category that aren't completed
        const categoryAlgorithms = await Algorithm.find({
          category: stats.strongestCategory,
          _id: { $nin: completedAlgorithmIds }
        }).limit(limit - recommendedAlgorithms.length);
        
        recommendedAlgorithms = [...recommendedAlgorithms, ...categoryAlgorithms];
      }
    }
    
    // If we still don't have enough, add some popular algorithms
    if (recommendedAlgorithms.length < limit) {
      // Find popular algorithms that aren't completed
      const popularAlgorithms = await Algorithm.find({
        _id: { $nin: [...completedAlgorithmIds, ...recommendedAlgorithms.map(a => a._id)] }
      })
        .sort({ userCount: -1 })
        .limit(limit - recommendedAlgorithms.length);
      
      recommendedAlgorithms = [...recommendedAlgorithms, ...popularAlgorithms];
    }
    
    return recommendedAlgorithms;
  }
  
  /**
   * Check for achievements based on user progress
   */
  private async checkAchievements(userId: string, algorithmId: string): Promise<void> {
    // Get user progress data
    const progress = await UserProgress.findOne({ user: userId, algorithm: algorithmId });
    
    if (!progress) {
      return;
    }
    
    // Get all achievements
    const achievements = await Achievement.find({ isActive: true });
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return;
    }
    
    // Get completed achievements
    const userAchievements = user.progress.achievements || [];
    
    // Check each achievement
    for (const achievement of achievements) {
      // Skip if user already has this achievement
      if (userAchievements.includes(achievement._id)) {
        continue;
      }
      
      let isEarned = false;
      
      // Check achievement criteria
      switch (achievement.criteria.type) {
        case 'algorithms_completed':
          // Count completed algorithms
          const completedCount = await UserProgress.countDocuments({
            user: userId,
            status: { $in: [ProgressStatus.COMPLETED, ProgressStatus.MASTERED] }
          });
          isEarned = completedCount >= achievement.criteria.value;
          break;
          
        case 'algorithms_mastered':
          // Count mastered algorithms
          const masteredCount = await UserProgress.countDocuments({
            user: userId,
            status: ProgressStatus.MASTERED
          });
          isEarned = masteredCount >= achievement.criteria.value;
          break;
          
        case 'specific_algorithm_completed':
          // Check if specific algorithm is completed
          if (achievement.criteria.algorithmId?.toString() === algorithmId) {
            isEarned = progress.status === ProgressStatus.COMPLETED || 
                       progress.status === ProgressStatus.MASTERED;
          }
          break;
          
        case 'category_completed':
          // Check if category is completed
          if (achievement.criteria.categoryId) {
            const algorithm = await Algorithm.findById(algorithmId);
            if (algorithm && algorithm.category.toString() === achievement.criteria.categoryId) {
              // Count completed algorithms in this category
              const categoryAlgorithmIds = await Algorithm.find({ 
                category: achievement.criteria.categoryId 
              }).distinct('_id');
              
              const completedCategoryCount = await UserProgress.countDocuments({
                user: userId,
                algorithm: { $in: categoryAlgorithmIds },
                status: { $in: [ProgressStatus.COMPLETED, ProgressStatus.MASTERED] }
              });
              
              isEarned = completedCategoryCount >= achievement.criteria.value;
            }
          }
          break;
          
        case 'time_spent':
          // Check total time spent
          const totalTime = await UserProgress.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: '$timeSpent' } } }
          ]);
          
          if (totalTime.length > 0) {
            isEarned = totalTime[0].total >= achievement.criteria.value;
          }
          break;
      }
      
      // Award achievement if earned
      if (isEarned) {
        // Add achievement to user
        await User.findByIdAndUpdate(userId, {
          $addToSet: { 'progress.achievements': achievement._id }
        });
        
        // Add achievement to progress if related to this algorithm
        if (achievement.criteria.algorithmId?.toString() === algorithmId) {
          await UserProgress.findOneAndUpdate(
            { user: userId, algorithm: algorithmId },
            { $addToSet: { achievements: achievement._id } }
          );
        }
      }
    }
  }
}

// Export singleton instance
const userProgressService = new UserProgressService();
export default userProgressService;