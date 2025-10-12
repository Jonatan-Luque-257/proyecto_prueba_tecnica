import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import peliculaRoutes from './src/routes/peliculaRoutes';
import { Request } from 'express';
import { AppDataSource } from './src/data-source';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// Inicializar conexión con TypeORM
AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a la base de datos establecida');

        // Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Rutas de películas
        app.use('/api/peliculas', peliculaRoutes);

        // Configuración de multer
        const upload = multer({ dest: 'uploads/' });

        // Ruta para subir archivos CSV
        interface MulterRequest extends Request {
            file?: Express.Multer.File;
        }

        app.post('/uploads', upload.single('file'), (req: MulterRequest, res) => {
            if (!req.file) {
                return res.status(400).json({ message: 'No se recibió ningún archivo CSV' });
            }
            const results: any[] = [];

            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No se recibió ningún archivo CSV' });
            }

            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    res.json({ rows: results });
                    fs.unlinkSync(file.path);
                });
        });

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar con la base de datos:', error);
    });