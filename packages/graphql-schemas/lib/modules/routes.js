import { addRoute, registerLocale } from 'meteor/vulcan:core';

addRoute({ name: 'movies', path: '/', componentName: 'Home' });
addRoute({ name: 'moviesSingle', path: '/movie/:id', componentName: 'MoviesSingle' });
addRoute({ name: 'schemasSingle', path: '/s/:slug', componentName: 'SchemasSingle' });
registerLocale({ id: 'en', label: 'English' });
