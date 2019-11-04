import { addRoute, registerLocale } from 'meteor/vulcan:core';

addRoute({ name: 'Home', path: '/', componentName: 'Home' });
addRoute({ name: 'schemasSingle', path: '/s/:slug', componentName: 'SchemasSingle' });
registerLocale({ id: 'en', label: 'English' });
