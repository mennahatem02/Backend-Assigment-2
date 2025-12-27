const express = require('express');
const userRoutes = require('./routes/useRoutes');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use('/users', userRoutes);


app.use((err,req, res, next) => {
res.send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});