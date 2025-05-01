import { mergeResolvers } from '@graphql-tools/merge';
import userResolvers from './userResolvers';
import algorithmResolvers from './algorithmResolvers';
import progressResolvers from './progressResolvers';
import learningPathResolvers from './learningPathResolvers';
import achievementResolvers from './achievementResolvers';

// Combine all resolvers
export const resolvers = mergeResolvers([
  userResolvers,
  algorithmResolvers,
  progressResolvers,
  learningPathResolvers,
  achievementResolvers
]);