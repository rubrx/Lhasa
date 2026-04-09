import app from './app';
import 'dotenv/config';

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
