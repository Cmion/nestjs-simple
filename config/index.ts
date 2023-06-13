export default () => ({
    api: {
        name: process.env.APP_NAME,
        port: parseInt(process.env.PORT, 10) || 3112,
        version: parseInt(process.env.APP_VERSION, 10) || 1,
    },
    database: {
        mongodb: {
            uri: process.env.MONGODB_URI
        }
    },
    workers: {
        rabbitmq: {
            uri: process.env.RMQ_URI
        },
        stock: {
            port: (parseInt(process.env.STOCK_WORKER_PORT, 10) || 3113)
        }
    }
});