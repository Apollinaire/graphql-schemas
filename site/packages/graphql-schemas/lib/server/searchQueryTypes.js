import { parse } from 'graphql';
import { mergeTypes, mergeNewType } from './contributionToTypes';


const searchQueryTypes = query => {
  let types = {};
  try {
    const docAST = parse(query);

  } catch (error) {
    throw error    
  }
  return types;
};

export default searchQueryTypes;
