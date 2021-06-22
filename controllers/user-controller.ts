import { UserService } from "../services/user-service";
import express from "express";
import { checkPassword } from "../hash";

export class UserController {
  constructor(private userService: UserService) {}

  editProfile = async (req: express.Request, res: express.Response) => {
    try {
      let info = req.body;
      console.log("user-controller: ", info);
      await this.userService.editProfile((req.session as any).user.id, {
        display_name: req.body.editDisplayName,
        email: req.body.editEmail,
        gender: req.body.editGender,
        age: req.body.editAge,
      });
      res.json("ok");
    } catch (error) {
      console.log(error);
      res.status(500).end("Failed to update profile");
    }
  };

  getProfile = async (req: express.Request, res: express.Response) => {
    try {
      console.log(req.session);

      let profile = await this.userService.getProfile(
        (req.session as any).user.id
      );
      res.json(profile);
    } catch (error) {
      console.log(error);
      res.status(500).end("Failed to get profile");
    }
  };

  logout = (req: express.Request, res: express.Response) => {
    req.session["user"] = false;
    res.status(200).end();
  };

  login = async (req: express.Request, res: express.Response) => {
    let user = await this.userService.getUserByUserName(req.body.username);
    if (!user) {
      res.status(403).end("wrong username");
      return;
    }
    if (!user.password) {
      res.status(403).end(`User didn't signup with password`);
      return;
    }
    let matched = await checkPassword(req.body.password, user.password);
    if (!matched) {
      res.status(403).end("wrong username or password");
      return;
    }
    delete user.password;
    req.session["user"] = user;
    res.end("Login Success");
  };

  register = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    if (!username) {
      res.status(400).end("missing username");
      return;
    }
    let password = req.body.password;
    if (!password) {
      res.status(400).end("missing password");
      return;
    }

    let result = await this.userService.createUser(username, password);
    if (result) {
      res.status(201).end("Created User");
    } else {
      console.log(result);
      res.status(500).end("Failed to create user");
    }
  };
  loginWithGoogle = async (req: express.Request, res: express.Response) => {
    const accessToken = req.session?.["grant"].response.access_token;
    if (!accessToken) {
      res.status(400).end("missing accessToken");
      return;
    }
    let user = await this.userService.createOrUpdateGoogleUser(accessToken);
    req.session["user"] = user;
    res.redirect("/profile.html");
  };

  getRole = (req: express.Request, res: express.Response) => {
    if (!req.session || !req.session["user"]) {
      res.end("guest");
      return;
    }
    if (req.session["user"].role === "admin") {
      res.end("admin");
      return;
    }
    res.end("normal");
  };
}
