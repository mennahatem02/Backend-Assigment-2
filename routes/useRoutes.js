const { Router } = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login
} = require("../controllers/userController");
const { uploader } = require("../utils/uploaderService");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

const router = Router();

router.get("", getUsers);
router.get("/dashboard", authMiddleware, getUsers);
router.get("/admin", authMiddleware, roleMiddleware("admin"), getUsers);



router.get("/:id", getUserById);

router.post("/auth/register", uploader.single("avatar"), createUser);
router.post("/auth/login", login);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
