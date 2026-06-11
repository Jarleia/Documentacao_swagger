const express = require('express');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const auth = require('./middleware/auth');

const app = express();
const PORT = 3000;

app.use(express.json());

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: API de Login
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello World
 *     responses:
 *       200:
 *         description: Funcionando
 */
app.get('/', (req, res) => {
    res.send('Hello World!');
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Fazer login
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Retorna token JWT
 */
app.post('/login', (req, res) => {

    const usuario = {
        id: 1,
        nome: 'Admin'
    };

    const token = jwt.sign(
        usuario,
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.json({
        mensagem: 'Login realizado',
        token
    });
});

/**
 * @swagger
 * /rota-protegida:
 *   get:
 *     summary: Exemplo de rota protegida
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado
 */
app.get(
    '/rota-protegida',
    auth,
    (req, res) => {

        res.json({
            mensagem:
                'Você acessou uma rota protegida!',
            usuario: req.usuario
        });

    }
);

const swaggerOptions = {

    definition: {
        openapi: '3.0.0',

        info: {
            title: 'API Backend Swagger',
            version: '1.0.0',
            description:
                'Documentação da API'
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },

        security: [
            {
                bearerAuth: []
            }
        ]
    },

    apis: ['./server.js']
};

const swaggerDocs =
    swaggerJsdoc(swaggerOptions);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
);

app.listen(PORT, () => {

    console.log(
        `Servidor rodando em:
http://localhost:${PORT}`
    );

});