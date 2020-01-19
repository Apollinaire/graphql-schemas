import { parse } from 'graphql';
import { mergeTypes, mergeNewType, ObjectTypes } from './contributionToTypes';


const searchQueryTypes = (query: string): ObjectTypes => {
  let types = {};
  try {
    const docAST = parse(query);

  } catch (error) {
    throw error    
  }
  return types;
};

export default searchQueryTypes;
