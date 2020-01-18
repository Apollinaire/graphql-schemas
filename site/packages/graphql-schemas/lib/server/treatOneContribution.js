import slugify from 'slugify';
import contributionToTypes, { objectToArrayTypes, mergeTypes, arrayToObjectTypes } from './contributionToTypes';

const treatOneContribution = async (_id, { Contributions, Schemas }) => {
  const contribution = await Contributions.findOne({ _id });
  const { query, responseBody, url } = contribution;
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
    // merge types
    const newTypes = objectToArrayTypes(mergeTypes(arrayToObjectTypes(schema.types), types));
    await Schemas.update({ _id: schema._id }, { $set: { types: newTypes } });
  }
  return true;
};

export default treatOneContribution;
