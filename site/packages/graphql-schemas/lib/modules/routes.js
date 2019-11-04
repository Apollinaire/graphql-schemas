import { addRoute, registerLocale } from 'meteor/vulcan:core';

addRoute({ name: 'Home', path: '/', componentName: 'Home' });
addRoute({ name: 'schemasSingle', path: '/s/:slug', componentName: 'SchemasSingle' });
addRoute({ name: 'contributionsList', path: '/c', componentName: 'ContributionsList' });
// addRoute({ name: 'contributionsSingle', path: '/c/:id', componentName: 'ContributionsSingle' });

registerLocale({ id: 'en', label: 'English' });
