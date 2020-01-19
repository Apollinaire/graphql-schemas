import slugify from 'slugify';
import contributionToTypes, { objectToArrayTypes, mergeTypes, arrayToObjectTypes } from './contributionToTypes';

const treatOneContribution = async (_id, { Contributions, Schemas }) => {
  try {
    
    const contribution = await Contributions.findOne({ _id });
    const { query, responseBody, variables, referer, url } = contribution;
    const types = contributionToTypes(query, responseBody);
    const schema = await Schemas.findOne({ endpoint: url });
    if (!schema) {
      // create new one
      const newSchema = {
        slug: slugify(url),
        endpoint: url,
        types: objectToArrayTypes(types),
      };
      await Schemas.insert(newSchema);
    } else {
      // console.log(JSON.stringify(arrayToObjectTypes(schema.types)))
      // merge types
      const newTypes = objectToArrayTypes(mergeTypes(arrayToObjectTypes(schema.types), types));
      await Schemas.update({ _id: schema._id }, { $set: { types: newTypes } });
    }
    return true;
  } catch (error) {
    console.log(error)
    return false
  }
};

export default treatOneContribution;
