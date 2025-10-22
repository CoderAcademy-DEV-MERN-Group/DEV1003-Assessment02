import { app, HOST, PORT, databaseURL, connectToDatabase } from './server';

if (process.env.NODE_ENV !== 'test') await connectToDatabase(databaseURL);

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
