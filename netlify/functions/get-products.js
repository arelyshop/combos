const { Pool } = require('pg');

exports.handler = async (event, context) => {
    // Esto es importante para Netlify Functions: evita que la función se quede 
    // esperando indefinidamente si hay conexiones de DB abiertas de fondo.
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        // Inicializamos la conexión a Neon usando la variable de entorno
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { 
                rejectUnauthorized: false 
            }
        });

        // Hacemos la consulta a la tabla que creaste
        const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
        
        // Cerramos el pool de conexiones
        await pool.end();

        // Devolvemos los datos al frontend (index.html)
        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                // Opcional: headers CORS por si pruebas en local
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(result.rows)
        };
    } catch (error) {
        console.error("Database error:", error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
