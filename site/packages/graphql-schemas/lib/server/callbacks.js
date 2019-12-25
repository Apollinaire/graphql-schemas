const contribution = {
  url: 'https://example.com/graphql',
  status: 'pending',
  userId: 'poqisdfjsldmkfjqdspfj',
  createdAt: "2019-11-26T15:45:31.862Z",
  query: 'query abc {} ...'
}

const contributionChecker = async (contribution) => {
  // get schema by url

    // if schema exists,
      // if this contribution is conflicting with known schema
        // mark is as conflict and let it be handled manually
      // else
        // recompute weights of exisiting types and add new types / fields
    // else
      // Add the types and contributor, add weights
}