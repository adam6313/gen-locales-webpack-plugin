const fs = require('fs');

module.exports = class GenLocalesWebpackPlugin {
  constructor(options) {
    this.options = options;

    this.init();
  }
  apply(compiler) {
    compiler.plugin("afterPlugins", () => {
       // check has locale key
       if (!this.has(this.source, 'locale')) throw new Error('locale key is required')

      // get locale
      const locales = this.source.locale

      // createFolder
      this.createFolder(this.options.path, this.options.dir)

      locales.forEach((locale, index) => {
        let result = this.fn(this.source, index)
        result = (result.substr(0, result.length - 1))

        const file = `${this.options.path}/${this.dir}/${locale}.js`
        fs.writeFileSync(file, `/* eslint-disable */  export default (${result})`)
      })
    })
  }

  init() {
    if (!this.options.path) {
      throw new Error('locale is required');
    }

    if (!this.options.target) {
      throw new Error('target is required');
    }

    const source = fs.readFileSync(`${this.options.path}/${this.options.target}`, "utf-8");
    this.source = JSON.parse(source);
  }

  has(object, key) {
    return object != null && Object.hasOwnProperty.call(object, key);
  }

  // createFolder -
  createFolder(path, dir = 'locales') {
    this.dir = dir

    if (fs.existsSync(`${path}/${dir}`)) return
    fs.mkdirSync(`${path}/${dir}`)
  }

  // Analysis object, Using recursive method
  fn(target, index, prev = '') {
    let str = ''
    switch (Array.isArray(target)) {
      case true:
        str += `'${target[index]}',`
        break;
      case false:
        Object.keys(target).forEach(next => {
          str += `'${next}':${this.fn(target[next], index, prev)}`
        })
        str = `{${str}},`
    }
    return prev += str
  }
};
