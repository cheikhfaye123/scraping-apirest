const express = require('express');
const fs = require('fs');
const { scrapearNoticias } = require('./scraping');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let noticias = [];


function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    noticias = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}


function guardarDatos() {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}


app.get('/scraping', async (req, res) => {
  try {
    const resultado = await scrapearNoticias();
    res.json({ mensaje: 'Scraping completado', noticias: resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error durante el scraping' });
  }
});


app.get('/noticias', (req, res) => {
  leerDatos();
  res.json(noticias);
});


app.get('/noticias/:id', (req, res) => {
  leerDatos();
  const id = parseInt(req.params.id);
  if (id >= 0 && id < noticias.length) {
    res.json(noticias[id]);
  } else {
    res.status(404).json({ error: 'Noticia no encontrada' });
  }
});


app.post('/noticias', (req, res) => {
  leerDatos();
  const nuevaNoticia = req.body;
  noticias.push(nuevaNoticia);
  guardarDatos();
  res.status(201).json(nuevaNoticia);
});


app.put('/noticias/:id', (req, res) => {
  leerDatos();
  const id = parseInt(req.params.id);
  if (id >= 0 && id < noticias.length) {
    noticias[id] = { ...noticias[id], ...req.body };
    guardarDatos();
    res.json(noticias[id]);
  } else {
    res.status(404).json({ error: 'Noticia no encontrada' });
  }
});

app.delete('/noticias/:id', (req, res) => {
  leerDatos();
  const id = parseInt(req.params.id);
  if (id >= 0 && id < noticias.length) {
    const noticiaEliminada = noticias.splice(id, 1);
    guardarDatos();
    res.json(noticiaEliminada[0]);
  } else {
    res.status(404).json({ error: 'Noticia no encontrada' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});