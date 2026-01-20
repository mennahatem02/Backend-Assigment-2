const fs = require("fs");
const path = require("path");
const { createUserSchema , idSchema } = require("../validations/userValidations");
const { sendMail } = require("../utils/mailService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let users = [];

const userFilePath = path.join(__dirname, "..", "db", "usersList.json");

const isExist = fs.existsSync(userFilePath);

if (isExist) {
  const UserList = fs.readFileSync(userFilePath, "utf-8");
  users = JSON.parse(UserList);
} else {
  fs.writeFileSync(userFilePath, JSON.stringify([]));
}

function getUsers(req, res, next) {
  if (users.length === 0) {
    const err = new Error("No users found");
   return next(err);
  }
  res.send({ message: "Users retrieved successfully", data: users });
}

function getUserById(req, res, next) {
  const {error , value}= idSchema.validate(req.params , {abortEarly:false});
   if (error) {
    error.status = 400;
    return next(error);
  }

  const { id } = value;
  const User = users.find((user) => user.id === Number(id));
  if (!User) {
    const err = new Error("User not found");
    return next(err);
  }
  res.send({ message: "User retrieved successfully", data: User });
}

// async function createUser(req, res, next) {
//   try {
//     const { value, error } = createUserSchema.validate(req.body, { abortEarly: false });

//     if (error) {
//       error.message = error.details.map(detail => detail.message);
//       return next(error);
//     }

//     const newUser = {
//       id: users.length + 1,
//       ...value,
//     };

//     users.push(newUser);
//     fs.writeFileSync(userFilePath, JSON.stringify(users));
//      sendMail(
//       "test@example.com",
//       "Test email dddddddddddddd",
//       "This is a test from Nodemailer"
//     );

//     res.send({ message: "User created successfully", data: newUser });

//   } catch (err) {
//     console.error("Controller error:", err);
//     res.status(500).send({ error: err.message });
//   }
// }

async function createUser(request, response, next) {
  try {
    // Data
    const { value, error } = createUserSchema.validate(request.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      const messages = error.details.map((err) => err.message);

      error.message = messages;

      return next(error);
    }

    const { email, password } = value;

    // Email Unique
    let user = users.find((item) => item.email == email);

    if (user) {
      const error = new Error("Email Already Exist!");
      error.status = 409;

      return next(error);
    }

    // Hash
    const hashedPassword = await bcrypt.hash(password, 12);

    // // Single File
  const avatar = request.file ? request.file.path : null;

    user = {
     id: users.length + 1,
      ...value,
      password: hashedPassword,
      avatar: avatar,
    };
    users.push(user);
    fs.writeFileSync(userFilePath, JSON.stringify(users));

    // Send Notification
   sendMail(email ,`Your account has been created successfully ${user.name}` , "Welcome to the platform",);
   const payload = { id: user.id, role: user.role };
   const secret = process.env.JWT_SECRET;
   const expiresIn = process.env.JWT_EXPIRES_IN || '3h';

   const token = jwt.sign(payload , secret , {expiresIn})

    response.status(201).json({ message: "User Create", data: {token} });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const {email , password} = req.body;
    const user = users.find((item) => item.email == email);
    if(!user){
      return res.status(404).json({message: 'User not found'});
    }
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        return res.status(401).json({message: 'Invalid Credentials'});
      }

      const payload = { id: user.id, role: user.role };
      const secret = process.env.JWT_SECRET;
   const expiresIn = process.env.JWT_EXPIRES_IN || '3h';

   const token = jwt.sign(payload , secret , {expiresIn})
   res.status(200).json({ message: "Login Successful", data: {token} });
  } catch (error) {
    next(error);
  }
}


function updateUser(req, res , next) {
  const { id } = req.params;
  const updatedData = req.body;
  const index = users.findIndex((user) => user.id === Number(id));
  if (index === -1) {
    const err = new Error("User not found");
    return next(err);
  }
  users[index] = { ...users[index], ...updatedData };
  fs.writeFileSync(userFilePath, JSON.stringify(users));
  res.send({ message: "User updated successfully", data: users[index] });
}

function deleteUser(req, res, next) {
  const {error , value}= idSchema.validate(req.params , {abortEarly:false});
   if (error) {
    error.status = 400;
    return next(error);
  }

  const { id } = value;
  const index = users.findIndex((user) => user.id === Number(id));
  if (index === -1) {
    const err = new Error("User not found");
    return next(err);
  }
  users.splice(index, 1);
  fs.writeFileSync(userFilePath, JSON.stringify(users));
  res.send({ message: "User deleted successfully" });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login
};
