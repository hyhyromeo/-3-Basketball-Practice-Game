import express from "express";
import { Multer } from "multer";
import { EventController } from "./controllers/event-controller";
import { UserController } from "./controllers/user-controller";

// use the isLoggedIn guard to make sure only admin can call this API
export function createRouter(options: {
  upload: Multer;
  userController: UserController;
  eventController: EventController;
}) {
  const { upload, userController } = options;
  const { eventController } = options;

  let router = express.Router();

  // user routes
  router.get("/login/google", userController.loginWithGoogle);
  router.get("/role", userController.getRole);
  router.post("/logout", userController.logout);
  router.post("/login", userController.login);
  router.post("/register", userController.register);
  router.get("/profile", userController.getProfile);
  router.post("/profile", upload.single("picture"), userController.editProfile);

  // event routes
  router.get("/ranking", eventController.getRanking);
  router.post("/events/:event_type", eventController.postResult);

  return router;
}
