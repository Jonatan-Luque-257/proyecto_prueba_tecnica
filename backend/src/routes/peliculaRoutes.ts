import { Router } from 'express';
import peliculaController from '../controllers/peliculaController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

// GET
router.get('/', peliculaController.getPeliculas);
router.get('/id/:id', peliculaController.getPeliculaById);
router.get('/nombre/:nombre', peliculaController.getPeliculaByNombre);
router.get('/estado/:estado', peliculaController.getPeliculasByEstado);

// POST
router.post('/', peliculaController.createPelicula);
router.post('/csv', upload.single('file'), peliculaController.createPeliculaFromCSV);

// PUT
router.put('/:id', peliculaController.updatePelicula);

// DELETE
router.delete('/logica/:id', peliculaController.deletePeliculaLogica);
router.delete('/fisica/:id', peliculaController.deletePeliculaFisica);

export default router;