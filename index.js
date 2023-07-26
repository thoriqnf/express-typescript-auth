const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.json());

const users = [
  {
    username: "thoriq",
    password: "password123",
  },
  {
    username: "auzan",
    password: "password123",
  },
  {
    username: "dila",
    password: "password123",
  },
  {
    username: "dolton",
    password: "password123",
    role: "admin",
  },
];

const books = [
  {
    books: "Harry Potter",
  },
  {
    books: "Lord of the rings",
  },
  {
    books: "The Secret",
  },
];

const accessTokenSecret = "verysecretpassword456";

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/login", (req, res) => {
  // untuk membaca input body yang dikirim user
  // console.log("req", req);
  const { username, password } = req.body;
  console.log("body", username, password);

  // mencocokan data dari body user kedalam array users
  const user = users.find((item) => {
    return item.username === username && item.password === password;
  });

  if (user) {
    const accessToken = jwt.sign(
      {
        username: user.username,
        role: user.role,
      },
      accessTokenSecret
    );

    res.json({
      accessToken,
    });
  } else {
    res.send("username atau password anda salah");
  }
});

// fungsi untuk mengecheck role
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("auth", authHeader);

  if (authHeader) {
    jwt.verify(authHeader, accessTokenSecret, (error, user) => {
      if (error) {
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// endpoint books hanya boleh diakses oleh role admin
app.get("/books", verifyJWT, (req, res) => {
  const { role } = req.user;
  console.log("role", role);
  if (role === "admin") {
    // res.send("ini admin");
    res.json(books);
  } else {
    res.send("anda bukan admin");
    res.sendStatus(401);
  }
});

app.listen(PORT, () => {
  console.log("running on port " + PORT);
});
