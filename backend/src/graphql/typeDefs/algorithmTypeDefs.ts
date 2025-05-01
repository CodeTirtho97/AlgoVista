import { gql } from 'apollo-server-express';

const algorithmTypeDefs = gql`
  enum AlgorithmCategory {
    sorting
    searching
    graph
    tree
    dynamic_programming
    greedy
    divide_and_conquer
    backtracking
    string
    data_structure
    miscellaneous
  }

  enum AlgorithmDifficulty {
    beginner
    intermediate
    advanced
    expert
  }

  enum ProgrammingLanguage {
    javascript
    python
    java
    cpp
  }

  enum TimeComplexity {
    O_1
    O_LOG_N
    O_N
    O_N_LOG_N
    O_N_2
    O_N_3
    O_2_N
    O_N_FACTORIAL
  }

  enum SpaceComplexity {
    O_1
    O_LOG_N
    O_N
    O_N_2
    O_N_3
    O_2_N
  }

  type Implementation {
    language: ProgrammingLanguage!
    code: String!
    defaultDataset: String!
    timeComplexity: TimeComplexity!
    spaceComplexity: SpaceComplexity!
  }

  type Visualization {
    steps: [VisualizationStep!]
    animationType: String!
    dataStructureType: String!
  }

  type VisualizationStep {
    id: ID!
    stepNumber: Int!
    description: String!
    codeLineHighlights: [Int!]
    stateSnapshot: String!
    animationData: String!
  }

  type Example {
    input: String!
    output: String!
    explanation: String
  }

  type Resource {
    title: String!
    url: String!
    type: String!
  }

  type Algorithm {
    id: ID!
    name: String!
    slug: String!
    description: String!
    category: AlgorithmCategory!
    difficulty: AlgorithmDifficulty!
    implementations: [Implementation!]!
    visualizations: Visualization
    examples: [Example!]!
    applications: [String!]!
    resources: [Resource!]!
    relatedAlgorithms: [Algorithm!]
    createdBy: User!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input ImplementationInput {
    language: ProgrammingLanguage!
    code: String!
    defaultDataset: String!
    timeComplexity: TimeComplexity!
    spaceComplexity: SpaceComplexity!
  }

  input ExampleInput {
    input: String!
    output: String!
    explanation: String
  }

  input ResourceInput {
    title: String!
    url: String!
    type: String!
  }

  input CreateAlgorithmInput {
    name: String!
    description: String!
    category: AlgorithmCategory!
    difficulty: AlgorithmDifficulty!
    implementations: [ImplementationInput!]!
    examples: [ExampleInput!]!
    applications: [String!]!
    resources: [ResourceInput!]!
    relatedAlgorithmIds: [ID!]
    isPublished: Boolean!
  }

  input UpdateAlgorithmInput {
    id: ID!
    name: String
    description: String
    category: AlgorithmCategory
    difficulty: AlgorithmDifficulty
    implementations: [ImplementationInput!]
    examples: [ExampleInput!]
    applications: [String!]
    resources: [ResourceInput!]
    relatedAlgorithmIds: [ID!]
    isPublished: Boolean
  }

  input AlgorithmFiltersInput {
    categories: [AlgorithmCategory!]
    difficulties: [AlgorithmDifficulty!]
    languages: [ProgrammingLanguage!]
    searchTerm: String
    createdById: ID
  }

  extend type Query {
    algorithm(id: ID!): Algorithm
    algorithmBySlug(slug: String!): Algorithm
    algorithms(
      filters: AlgorithmFiltersInput
      page: Int
      limit: Int
    ): [Algorithm!]!
    algorithmCount(filters: AlgorithmFiltersInput): Int!
    relatedAlgorithms(algorithmId: ID!, limit: Int): [Algorithm!]!
  }

  extend type Mutation {
    createAlgorithm(input: CreateAlgorithmInput!): Algorithm!
    updateAlgorithm(input: UpdateAlgorithmInput!): Algorithm!
    deleteAlgorithm(id: ID!): Boolean!
    executeAlgorithm(
      algorithmId: ID!
      language: ProgrammingLanguage!
      input: String!
      customCode: String
    ): String!
  }

  extend type Subscription {
    algorithmExecutionProgress(executionId: ID!): String!
  }
`;

export default algorithmTypeDefs;