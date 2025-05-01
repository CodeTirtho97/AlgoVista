import { algorithmLibraryService } from '../services';
import { Algorithm, User, AlgorithmCategory, AlgorithmDifficulty, ProgrammingLanguage } from '../models';

describe('Algorithm Library Service', () => {
  let testUserId: string;
  let testAlgorithmId: string;
  
  beforeAll(async () => {
    // Create a test user
    const user = new User({
      email: 'algo-test@example.com',
      password: 'Password123!',
      username: 'algotest',
      firstName: 'Algorithm',
      lastName: 'Tester'
    });
    
    await user.save();
    testUserId = user._id.toString();
  });
  
  describe('Algorithm CRUD Operations', () => {
    const testAlgorithm = {
      name: 'Test Sorting Algorithm',
      description: 'A simple test sorting algorithm',
      category: AlgorithmCategory.SORTING,
      difficulty: AlgorithmDifficulty.BEGINNER,
      implementations: [
        {
          language: ProgrammingLanguage.JAVASCRIPT,
          code: 'function execute(input) { return input.sort((a, b) => a - b); }',
          defaultDataset: '[5, 3, 8, 1, 2]',
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(1)'
        }
      ],
      examples: [
        {
          input: '[5, 3, 8, 1, 2]',
          output: '[1, 2, 3, 5, 8]',
          explanation: 'Sorts the array in ascending order'
        }
      ],
      applications: ['Used in database indexing', 'Used in list sorting'],
      resources: [
        {
          title: 'Sorting Algorithms',
          url: 'https://example.com/sorting',
          type: 'article'
        }
      ],
      isPublished: true
    };
    
    it('should create a new algorithm', async () => {
      const algorithm = await algorithmLibraryService.createAlgorithm(
        testUserId,
        testAlgorithm
      );
      
      expect(algorithm).toBeDefined();
      expect(algorithm.name).toBe(testAlgorithm.name);
      expect(algorithm.category).toBe(testAlgorithm.category);
      expect(algorithm.createdBy.toString()).toBe(testUserId);
      
      // Save ID for later tests
      testAlgorithmId = algorithm._id.toString();
    });
    
    it('should retrieve an algorithm by ID', async () => {
      const algorithm = await algorithmLibraryService.getAlgorithmById(testAlgorithmId);
      
      expect(algorithm).toBeDefined();
      expect(algorithm.name).toBe(testAlgorithm.name);
      expect(algorithm._id.toString()).toBe(testAlgorithmId);
    });
    
    it('should retrieve an algorithm by slug', async () => {
      // Get algorithm to find its generated slug
      const savedAlgorithm = await Algorithm.findById(testAlgorithmId);
      const slug = savedAlgorithm?.slug;
      
      const algorithm = await algorithmLibraryService.getAlgorithmBySlug(slug as string);
      
      expect(algorithm).toBeDefined();
      expect(algorithm.name).toBe(testAlgorithm.name);
      expect(algorithm._id.toString()).toBe(testAlgorithmId);
    });
    
    it('should update an algorithm', async () => {
      const updates = {
        name: 'Updated Algorithm Name',
        description: 'Updated description',
        difficulty: AlgorithmDifficulty.INTERMEDIATE
      };
      
      const algorithm = await algorithmLibraryService.updateAlgorithm(
        testUserId,
        testAlgorithmId,
        updates
      );
      
      expect(algorithm).toBeDefined();
      expect(algorithm.name).toBe(updates.name);
      expect(algorithm.description).toBe(updates.description);
      expect(algorithm.difficulty).toBe(updates.difficulty);
      expect(algorithm.category).toBe(testAlgorithm.category); // Unchanged
    });
    
    it('should retrieve algorithms with filters', async () => {
      // Create a couple more algorithms
      await algorithmLibraryService.createAlgorithm(
        testUserId,
        {
          ...testAlgorithm,
          name: 'Bubble Sort',
          category: AlgorithmCategory.SORTING
        }
      );
      
      await algorithmLibraryService.createAlgorithm(
        testUserId,
        {
          ...testAlgorithm,
          name: 'BFS',
          category: AlgorithmCategory.GRAPH
        }
      );
      
      // Test filtering by category
      const sortingAlgorithms = await algorithmLibraryService.getAlgorithms({
        categories: [AlgorithmCategory.SORTING]
      });
      
      expect(sortingAlgorithms.length).toBeGreaterThanOrEqual(2);
      
      // Test filtering by difficulty
      const intermediateAlgorithms = await algorithmLibraryService.getAlgorithms({
        difficulties: [AlgorithmDifficulty.INTERMEDIATE]
      });
      
      expect(intermediateAlgorithms.length).toBeGreaterThanOrEqual(1);
      
      // Test search term
      const searchResults = await algorithmLibraryService.getAlgorithms({
        searchTerm: 'Updated'
      });
      
      expect(searchResults.length).toBeGreaterThanOrEqual(1);
      expect(searchResults[0].name).toContain('Updated');
    });
    
    it('should delete an algorithm', async () => {
      const result = await algorithmLibraryService.deleteAlgorithm(testUserId, testAlgorithmId);
      
      expect(result).toBe(true);
      
      // Verify it's deleted
      try {
        await algorithmLibraryService.getAlgorithmById(testAlgorithmId);
        fail('Algorithm should have been deleted');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});