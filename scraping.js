const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

async function scrapearNoticias() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let noticias = [];

    $('.articulo').each((index, element) => {
      const titulo = $(element).find('.titular a').text().trim();
      const imagen = $(element).find('img').attr('src');
      const descripcion = $(element).find('.articulo-subtitulo').text().trim();
      const enlace = $(element).find('.titular a').attr('href');

      const noticia = {
        titulo,
        imagen,
        descripcion,
        enlace: `https://elpais.com${enlace}`,
      };

      noticias.push(noticia);
    });

    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    console.log('Scraping completado. Datos guardados en noticias.json');
    return noticias;
  } catch (error) {
    console.error('Error durante el scraping:', error.message);
    throw error;
  }
}

module.exports = { scrapearNoticias };