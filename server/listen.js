const app = require("../server/app");
const port = 9090;

app.listen(port, (err) => {
  console.log(`Error on listening on port:${port}`);
});
