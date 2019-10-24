import _ from 'underscore';

// const argumentInputCleaner = argInput => {
//   const colonIndex = argInput.indexOf(':');
//   if (!~colonIndex) {
//     throw Error('missing colon in argument input')
//   }
//   const definition = argInput.slice(colonIndex);

//   // at this point, the input should be either:
//   // '$variableName:Typename' 'argumentName:$variableName' --> these can pass
//   // '$variableName:true' 'argumentName:true' -> change true or false to Boolean
//   // '$variableName:"stringValue"' 'argumentName:"stringValue" -> change "stringValue" to String
//   // '$variableName:1234' 'argumentName:1234' -> change 1234 to Int or Float
//   // todo check if we can have null

//   return 
// };

// const argumentCleaner = arg => {
//   // remove starting & ending parenthesis
//   arg = arg.slice(1).slice(0, -1);
//   // poor man's safety : while we don't have a decent parser for args, throw to avoid sending values
//   if (~arg.indexOf('(') || ~arg.indexOf(')')) {
//     throw Error('invalid argument parsing');
//   }
//   // remove all spaces
//   arg.replace(/ /g, '');
//   // split to individual arg
//   const args = arg.split(',');
//   const cleanArgs = _.map(args, argumentInputCleaner);

//   return `(${_.reduce(cleanArgs, (prev, curr, index) => (index ? `${prev}, ${curr}` : curr), '')})`;
// };

const queryCleaner = query => {
  // remove all arguments :'(
  return query.replace(/\(([^)]+)\)/g, '(__ARGUMENT_PLACEHOLDER__)');



  
  // todo : recursive descent parse to avoid breaking when argument contents have parentheses within
  // find everything inside parentheses
  // const argumentArray = query.match(/\(([^)]+)\)/);
  
  // get a sanitized version of the arg contents 
  // if (argumentArray) {
    // const cleanArgumentArray = _.map(argumentArray, argumentCleaner);
    
    // remove arguments value inside query
    // _.forEach(argumentArray, (value, index) => {
      // query.replace(value, cleanArgumentArray[index])
    // })
  // }




};

export default queryCleaner;
