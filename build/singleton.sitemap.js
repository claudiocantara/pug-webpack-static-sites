const Sitemap = require('./sitemap.config');
let instance;

const Singleton = () => {

  const createInstance = () => {
    return Sitemap;
  };

  const getInstance = () => {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  };

  return {
    getInstance,
  };

}


module.exports =  Singleton() ;
