import fetch from "node-fetch";
import { GoogleResult, User } from "../models/user";
import { hashPassword } from "../hash";
import { Knex } from "knex";

type Profile = {
  display_name: string;
  email: string;
  gender: string;
  age: string;
};

export class UserService {
  constructor(private knex: Knex) {}

  async editProfile(id: number, profile: Profile) {
    await this.knex("users").where("users.id", id).update(profile);
    console.log("users: ", profile);
  }

  async getProfile(id: number) {
    return this.knex
      .select(
        "user_name",
        "display_name",
        "email",
        "gender",
        "age",
        "profile_pic"
      )
      .from("users")
      .where("users.id", id)
      .first();
  }

  async createUser(username: string, password: string) {
    let passwordHash = await hashPassword(password);
    return this.knex
      .insert({ username, password: passwordHash })
      .into("users")
      .returning("id");
  }

  async getUserByUserName(username: string): Promise<User> {
    return this.knex.select("*").from("users").where({ username }).first();
  }

  async createOrUpdateGoogleUser(accessToken: string): Promise<User> {
    const fetchRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const fetchResult: GoogleResult = await fetchRes.json();

    let user: User = await this.knex
      .select("*")
      .from("users")
      .where({ email: fetchResult.email })
      .first();

    // if this user is new comer
    if (!user) {
      let insertResult = await this.knex
        .insert({
          email: fetchResult.email,
          google_access_token: accessToken,
          profile_pic: fetchResult.picture,
        })
        .into("users")
        .returning("*");

      let user = insertResult[0];
      delete user.google_access_token;
      return user;
    }

    // if this user already registered
    await this.knex("users")
      .update({ google_access_token: accessToken })
      .where({ id: user.id });

    user.google_access_token = accessToken;
    delete user.password;
    return user;
  }
}
