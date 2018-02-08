let urlCollection = [];

const getAllURL = () => {
  return urlCollection;
}

const creatSiteMap = () => {
  const urls = urlCollection.join('\n');
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${urls}
  </urlset>`;
}

const addURL = url => {
  const urlMap = `<url>
      <loc>${url}</loc>
      <changefreq>weekly</changefreq>
    </url>`;

  urlCollection.push(urlMap);
};

module.exports = {
  addURL : addURL,
  getAllURL : getAllURL,
  creatSiteMap : creatSiteMap
}
