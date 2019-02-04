Package.describe({
  name: 'graphql-schemas',
});

Package.onUse(function (api) {

  api.use([

    'promise',

    // vulcan core
    'vulcan:core@1.12.12',

    // vulcan packages
    'vulcan:forms@1.12.12',
    'vulcan:accounts@1.12.12',
    'vulcan:ui-bootstrap@1.12.12',
    
  ]);

  api.addFiles('lib/stylesheets/custom-css-bootstrap-magic-2019-02-04.css');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
