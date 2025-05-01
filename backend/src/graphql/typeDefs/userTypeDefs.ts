import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
  enum UserRole {
    user
    admin
  }

  type EditorSettings {
    fontSize: Int!
    tabSize: Int!
    language: String!
  }

  type UserSettings {
    theme: String!
    codeEditorSettings: EditorSettings!
  }

  type UserProgress {
    completedAlgorithms: [Algorithm!]
    currentLearningPath: LearningPath
    achievements: [Achievement!]
  }

  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String
    lastName: String
    role: UserRole!
    lastLogin: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
    algorithms: [Algorithm!]
    progress: UserProgress!
    settings: UserSettings!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    username: String!
    firstName: String
    lastName: String
  }

  input UpdateUserInput {
    email: String
    username: String
    firstName: String
    lastName: String
  }

  input UpdateUserSettingsInput {
    theme: String
    codeEditorSettings: EditorSettingsInput
  }

  input EditorSettingsInput {
    fontSize: Int
    tabSize: Int
    language: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
  }

  extend type Mutation {
    login(input: LoginInput!): AuthResponse!
    register(input: RegisterInput!): AuthResponse!
    updateUser(input: UpdateUserInput!): User!
    updateUserSettings(input: UpdateUserSettingsInput!): UserSettings!
    changePassword(input: ChangePasswordInput!): Boolean!
    deleteAccount: Boolean!
  }
`;

export default userTypeDefs;