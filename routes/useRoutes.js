const { Router } = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { uploader } = require("../utils/uploaderService");

const router = Router();

router.get("", getUsers);

router.get("/:id", getUserById);

router.post("", uploader.single("avatar"), createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
