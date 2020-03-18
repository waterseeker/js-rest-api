import app from './src/app';

const { PORT } = process.env;

// eslint-disable-next-line no-console
export const server = app.listen(PORT, () => console.log(`App is listening at http://localhost:${PORT}/`));

export default server;
