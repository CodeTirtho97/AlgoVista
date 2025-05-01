import { gql } from 'apollo-server-express';

const achievementTypeDefs = gql`
  enum AchievementCategory {
    learning
    mastery
    participation
    challenge
    special
  }

  type AchievementCriteria {
    type: String!
    value: Int!
    algorithmId: ID
    categoryId: String
  }

  type Achievement {
    id: ID!
    name: String!
    description: String!
    icon: String!
    category: AchievementCategory!
    points: Int!
    criteria: AchievementCriteria!
    isSecret: Boolean!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type UserAchievement {
    achievement: Achievement!
    unlockedAt: String!
  }

  input AchievementCriteriaInput {
    type: String!
    value: Int!
    algorithmId: ID
    categoryId: String
  }

  input CreateAchievementInput {
    name: String!
    description: String!
    icon: String!
    category: AchievementCategory!
    points: Int!
    criteria: AchievementCriteriaInput!
    isSecret: Boolean!
    isActive: Boolean!
  }

  input UpdateAchievementInput {
    id: ID!
    name: String
    description: String
    icon: String
    category: AchievementCategory
    points: Int
    criteria: AchievementCriteriaInput
    isSecret: Boolean
    isActive: Boolean
  }

  extend type Query {
    achievement(id: ID!): Achievement
    achievements(category: AchievementCategory): [Achievement!]!
    userAchievements: [UserAchievement!]!
  }

  extend type Mutation {
    createAchievement(input: CreateAchievementInput!): Achievement!
    updateAchievement(input: UpdateAchievementInput!): Achievement!
    deleteAchievement(id: ID!): Boolean!
  }
`;

export default achievementTypeDefs;