import express from 'express';
import bodyParser from 'body-parser';
// import inventoryRoutes from './routes/inventoryRoutes.js'; // Placeholder for existing routes
import imageUploadRoute from './imageUploadRoute.js'; //import the new upload route

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//if we're hosting on Vercel/Railway, might need CORS headers here


//register image Upload/Scan route
//prefixing with /api/v1/inventory, but the router handles the /scan part
app.use('/api/v1/inventory', imageUploadRoute);

app.get('/', (req, res) => {
    res.send('MealMingle Backend Service Running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});