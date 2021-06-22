import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", (table) => {
      table.increments();
      table.string("user_name", 50).unique();
      table.string("password", 50);
      table.string("display_name", 50);
      table.string("email", 50);
      table.string("gender", 10);
      table.string("age", 2);
      table.text("description");
      table.string("profile_pic");
      table.string("google_access_token");
      table.string("role").defaultTo('user')
      table.timestamps(false, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
