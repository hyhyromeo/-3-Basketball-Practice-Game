import { knex } from "../db";
import { UserService } from "../services/user-service";

let userService = new UserService(knex);
async function getProfile() {
  let result = await userService.getProfile(15);
  console.log(result);
}

getProfile();