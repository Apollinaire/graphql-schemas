module.exports = function(api) {
  api.cache(true)
  return {
    presets: ['@babel/react', '@babel/env', '@babel/typescript'],
    plugins: ['react-hot-loader/babel', '@babel/plugin-proposal-class-properties'],
  };
};
