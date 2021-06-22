import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable("event_type"))) {
    await knex.schema.createTable("event_type", (table) => {
      table.increments();
      table.string("event_type");
      table.timestamps(false, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("event_type");
}
