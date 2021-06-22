import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable("events"))) {
    await knex.schema.createTable("events", (table) => {
      table.increments();
      table.integer("points");
      table.date("event_date");
      table.integer("user_id").unsigned().references("users.id");
      table.integer("event_type_id").unsigned().references("event_type.id");
      table.timestamps(false, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("events");
}
