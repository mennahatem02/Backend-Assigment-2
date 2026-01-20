const express = require('express');
const userRoutes = require('./routes/useRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000 ;


app.use(cors({origin:process.env.CLIENT_URL}));
app.use(express.json());
app.use('', userRoutes);



app.use((err,req, res, next) => {
res.send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});