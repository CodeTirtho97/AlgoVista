import { gql } from 'apollo-server-express';

const progressTypeDefs = gql`
  enum ProgressStatus {
    not_started
    in_progress
    completed
    mastered
  }

  type ProgressRatings {
    difficulty: Int
    understanding: Int
    visualization: Int
  }

  type UserProgressDetails {
    id: ID!
    user: User!
    algorithm: Algorithm!
    status: ProgressStatus!
    completedSteps: Int!
    totalSteps: Int!
    attempts: Int!
    lastAttemptDate: String
    timeSpent: Int!
    notes: String
    ratings: ProgressRatings
    achievements: [Achievement!]!
    completionPercentage: Int!
    createdAt: String!
    updatedAt: String!
  }

  input UpdateProgressInput {
    algorithmId: ID!
    completedSteps: Int
    totalSteps: Int
    timeSpent: Int
    notes: String
    ratings: ProgressRatingsInput
  }

  input ProgressRatingsInput {
    difficulty: Int
    understanding: Int
    visualization: Int
  }

  extend type Query {
    userProgress(algorithmId: ID!): UserProgressDetails
    userProgressList(status: ProgressStatus): [UserProgressDetails!]!
    userProgressStats: UserProgressStats!
  }

  type UserProgressStats {
    algorithmsStarted: Int!
    algorithmsCompleted: Int!
    algorithmsMastered: Int!
    totalTimeSpent: Int!
    averageCompletionRate: Float!
    strongestCategory: AlgorithmCategory
    recommendedAlgorithms: [Algorithm!]!
  }

  extend type Mutation {
    updateProgress(input: UpdateProgressInput!): UserProgressDetails!
    recordAttempt(algorithmId: ID!): UserProgressDetails!
    resetProgress(algorithmId: ID!): Boolean!
    addProgressNote(algorithmId: ID!, note: String!): UserProgressDetails!
    rateAlgorithm(algorithmId: ID!, ratings: ProgressRatingsInput!): UserProgressDetails!
  }
`;

export default progressTypeDefs;