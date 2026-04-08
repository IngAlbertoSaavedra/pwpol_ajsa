const bcrypt = require("bcrypt");

const hash = "$2b$10$s3s0jbN1bozHhFB5joCp1OdlqDyk0e9Izpz8iroc5iOb8jPGYlvIW";
const password = "Admin@12345";

bcrypt.compare(password, hash)
  .then(result => {
    console.log("Coincide:", result);
  })
  .catch(error => {
    console.error(error);
  });