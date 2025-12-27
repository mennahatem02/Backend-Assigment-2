const fs = require("fs");
const path = require("path");

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
  const { id } = req.params;
  const User = users.find((user) => user.id === Number(id));
  if (!User) {
    const err = new Error("User not found");
    return next(err);
  }
  res.send({ message: "User retrieved successfully", data: User });
}

function createUser(req, res) {
  const newUser = {
    id: users.length + 1,
    ...req.body,
  };
  users.push(newUser);
  fs.writeFileSync(userFilePath, JSON.stringify(users));
  res.send({ message: "User created successfully", data: newUser });
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
  const { id } = req.params;
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
};
