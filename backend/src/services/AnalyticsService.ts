import mongoose from 'mongoose';
import { Algorithm, UserProgress, User, LearningPath, ProgressStatus, AlgorithmCategory } from '../models';

interface AlgorithmUsageStats {
  algorithmId: string;
  algorithmName: string;
  viewCount: number;
  completionCount: number;
  averageTimeSpent: number;
  averageRating: number;
  category: AlgorithmCategory;
}

interface UserLearningStats {
  totalUsers: number;
  activeUsers: number;
  newUsersLast30Days: number;
  averageAlgorithmsPerUser: number;
  averageTimePerAlgorithm: number;
  mostPopularCategories: { category: AlgorithmCategory; count: number }[];
}

export class AnalyticsService {
  /**
   * Get algorithm usage statistics
   */
  public async getAlgorithmUsageStats(days: number = 30): Promise<AlgorithmUsageStats[]> {
    // Calculate date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    
    // Get all algorithms
    const algorithms = await Algorithm.find({ isPublished: true });
    
    const algorithmStats: AlgorithmUsageStats[] = [];
    
    for (const algorithm of algorithms) {
      // Count views/attempts
      const viewCount = await UserProgress.countDocuments({
        algorithm: algorithm._id,
        updatedAt: { $gte: dateThreshold }
      });
      
      // Count completions
      const completionCount = await UserProgress.countDocuments({
        algorithm: algorithm._id,
        status: { $in: [ProgressStatus.COMPLETED, ProgressStatus.MASTERED] },
        updatedAt: { $gte: dateThreshold }
      });
      
      // Calculate average time spent
      const timeSpentResult = await UserProgress.aggregate([
        {
          $match: {
            algorithm: algorithm._id,
            updatedAt: { $gte: dateThreshold },
            timeSpent: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            averageTime: { $avg: '$timeSpent' }
          }
        }
      ]);
      
      const averageTimeSpent = timeSpentResult.length > 0 ? timeSpentResult[0].averageTime : 0;
      
      // Calculate average rating (visualization rating)
      const ratingResult = await UserProgress.aggregate([
        {
          $match: {
            algorithm: algorithm._id,
            updatedAt: { $gte: dateThreshold },
            'ratings.visualization': { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$ratings.visualization' }
          }
        }
      ]);
      
      const averageRating = ratingResult.length > 0 ? ratingResult[0].averageRating : 0;
      
      algorithmStats.push({
        algorithmId: algorithm._id.toString(),
        algorithmName: algorithm.name,
        viewCount,
        completionCount,
        averageTimeSpent,
        averageRating,
        category: algorithm.category
      });
    }
    
    // Sort by view count descending
    return algorithmStats.sort((a, b) => b.viewCount - a.viewCount);
  }
  
  /**
   * Get user learning statistics
   */
  public async getUserLearningStats(days: number = 30): Promise<UserLearningStats> {
    // Calculate date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    
    // Total users
    const totalUsers = await User.countDocuments();
    
    // Active users (users with progress updates in the period)
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: dateThreshold }
    });
    
    // New users in the period
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: dateThreshold }
    });
    
    // Average algorithms per user
    const algorithmsPerUserResult = await UserProgress.aggregate([
      {
        $match: {
          status: { $ne: ProgressStatus.NOT_STARTED }
        }
      },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          averageCount: { $avg: '$count' }
        }
      }
    ]);
    
    const averageAlgorithmsPerUser = algorithmsPerUserResult.length > 0
      ? algorithmsPerUserResult[0].averageCount
      : 0;
    
    // Average time per algorithm
    const timePerAlgorithmResult = await UserProgress.aggregate([
      {
        $match: {
          timeSpent: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          averageTime: { $avg: '$timeSpent' }
        }
      }
    ]);
    
    const averageTimePerAlgorithm = timePerAlgorithmResult.length > 0
      ? timePerAlgorithmResult[0].averageTime
      : 0;
    
    // Most popular categories
    const popularCategoriesResult = await Algorithm.aggregate([
      {
        $match: {
          _id: {
            $in: await UserProgress.distinct('algorithm', {
              updatedAt: { $gte: dateThreshold }
            })
          }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    const mostPopularCategories = popularCategoriesResult.map(item => ({
      category: item.category as AlgorithmCategory,
      count: item.count
    }));
    
    return {
      totalUsers,
      activeUsers,
      newUsersLast30Days,
      averageAlgorithmsPerUser,
      averageTimePerAlgorithm,
      mostPopularCategories
    };
  }
  
  /**
   * Get learning path statistics
   */
  public async getLearningPathStats(): Promise<any[]> {
    // Find all learning paths
    const learningPaths = await LearningPath.find({ isPublished: true });
    
    const pathStats = [];
    
    for (const path of learningPaths) {
      // Count users enrolled in this path
      const enrolledUsers = await User.countDocuments({
        'progress.currentLearningPath': path._id
      });
      
      // Calculate completion rate (users who completed all algorithms in the path)
      let completionRate = 0;
      
      if (enrolledUsers > 0) {
        const algorithmIds = path.algorithms.map(a => a.algorithm);
        
        // For each enrolled user, check if they completed all algorithms
        const usersWithPath = await User.find({
          'progress.currentLearningPath': path._id
        });
        
        let completedUsers = 0;
        
        for (const user of usersWithPath) {
          // Count how many algorithms in the path the user has completed
          const completedCount = await UserProgress.countDocuments({
            user: user._id,
            algorithm: { $in: algorithmIds },
            status: { $in: [ProgressStatus.COMPLETED, ProgressStatus.MASTERED] }
          });
          
          // If user completed all algorithms, increment counter
          if (completedCount === algorithmIds.length) {
            completedUsers++;
          }
        }
        
        completionRate = (completedUsers / enrolledUsers) * 100;
      }
      
      pathStats.push({
        pathId: path._id.toString(),
        pathName: path.name,
        enrolledUsers,
        completionRate,
        category: path.category,
        difficulty: path.difficulty,
        estimatedHours: path.estimatedHours
      });
    }
    
    return pathStats;
  }
  
  /**
   * Track event for analytics
   */
  public trackEvent(userId: string, eventType: string, data: any): void {
    // This would typically store events in a separate collection
    // For this implementation, we'll just log the event
    console.log(`[Analytics] User ${userId} - Event: ${eventType}`, data);
    
    // In a production system, you would:
    // 1. Create an Events collection
    // 2. Store events with timestamp, user, type, and data
    // 3. Use these events for analytics dashboards
    // 4. Consider using a dedicated analytics service for high-volume tracking
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;