const { default: mongoose } = require("mongoose");
const db = process.env.DATABASE;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connection Successfuly"))
  .catch((error) => {
    console.log("Error: ", error);
  });
