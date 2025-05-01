import { gql } from 'apollo-server-express';
import userTypeDefs from './userTypeDefs';
import algorithmTypeDefs from './algorithmTypeDefs';
import progressTypeDefs from './progressTypeDefs';
import learningPathTypeDefs from './learningPathTypeDefs';
import achievementTypeDefs from './achievementTypeDefs';

// Base type definitions
const baseTypeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

// Combine all type definitions
export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  algorithmTypeDefs,
  progressTypeDefs,
  learningPathTypeDefs,
  achievementTypeDefs
];