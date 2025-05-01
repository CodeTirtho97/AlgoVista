import { gql } from 'apollo-server-express';

const learningPathTypeDefs = gql`
  enum LearningPathType {
    standard
    custom
    recommended
  }

  type AlgorithmInPath {
    algorithm: Algorithm!
    order: Int!
    requiredToAdvance: Boolean!
  }

  type LearningPath {
    id: ID!
    name: String!
    description: String!
    slug: String!
    type: LearningPathType!
    category: AlgorithmCategory!
    difficulty: AlgorithmDifficulty!
    algorithms: [AlgorithmInPath!]!
    prerequisites: [Algorithm!]!
    estimatedHours: Int!
    tags: [String!]!
    createdBy: User!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
    userCount: Int!
    completionRate: Float!
    activeUsers: [User!]
  }

  input AlgorithmInPathInput {
    algorithmId: ID!
    order: Int!
    requiredToAdvance: Boolean!
  }

  input CreateLearningPathInput {
    name: String!
    description: String!
    category: AlgorithmCategory!
    difficulty: AlgorithmDifficulty!
    algorithms: [AlgorithmInPathInput!]!
    prerequisiteIds: [ID!]!
    estimatedHours: Int!
    tags: [String!]!
    isPublished: Boolean!
  }

  input UpdateLearningPathInput {
    id: ID!
    name: String
    description: String
    category: AlgorithmCategory
    difficulty: AlgorithmDifficulty
    algorithms: [AlgorithmInPathInput!]
    prerequisiteIds: [ID!]
    estimatedHours: Int
    tags: [String!]
    isPublished: Boolean
  }

  input LearningPathFiltersInput {
    categories: [AlgorithmCategory!]
    difficulties: [AlgorithmDifficulty!]
    types: [LearningPathType!]
    searchTerm: String
    createdById: ID
  }

  type UserLearningPathProgress {
    learningPath: LearningPath!
    completedAlgorithms: Int!
    totalAlgorithms: Int!
    completionPercentage: Float!
    currentAlgorithm: Algorithm
    startedAt: String!
    lastActivityAt: String
  }

  extend type Query {
    learningPath(id: ID!): LearningPath
    learningPathBySlug(slug: String!): LearningPath
    learningPaths(
      filters: LearningPathFiltersInput
      page: Int
      limit: Int
    ): [LearningPath!]!
    learningPathCount(filters: LearningPathFiltersInput): Int!
    recommendedLearningPaths(limit: Int): [LearningPath!]!
    userLearningPathProgress: UserLearningPathProgress
  }

  extend type Mutation {
    createLearningPath(input: CreateLearningPathInput!): LearningPath!
    updateLearningPath(input: UpdateLearningPathInput!): LearningPath!
    deleteLearningPath(id: ID!): Boolean!
    enrollInLearningPath(learningPathId: ID!): UserLearningPathProgress!
    leaveLearningPath: Boolean!
  }
`;

export default learningPathTypeDefs;