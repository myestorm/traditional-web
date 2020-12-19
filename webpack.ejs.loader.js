const { getOptions } = require('loader-utils');
const ejs = require('ejs');
const merge = require('merge');
const path = require('path');

module.exports =  function (source) {
  this.cacheable && this.cacheable();

  const options = getOptions(this);

  const opts = merge({
    client: true
  }, options);

  const template = ejs.compile(source, merge(opts, {
    filename: path.relative(process.cwd(), this.resourcePath),
    webpack: this
  })).toString();

  return `module.exports =  ${template}`;
};
