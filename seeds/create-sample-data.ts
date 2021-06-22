import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("events").del();
  await knex("event_type").del();
  await knex("users").del();

  // Inserts seed entries
  const users = await knex("users")
    .insert([
      {
        user_name: "JackGor",
        password: "pw",
        display_name: "CurryJack",
        email: "curryJack@gmail.com",
        gender: "M",
        age: "15",
        role: "admin",
      },
      {
        user_name: "SeanTecky",
        password: "pw",
        display_name: "JordanSean",
        email: "JordanSean@gmail.com",
        gender: "M",
        age: "16",
        role: "admin",
      },
      {
        user_name: "RomeoTecky",
        password: "pw",
        display_name: "RomeoGor",
        email: "romeoGor@gmail.com",
        gender: "M",
        age: "17",
      },
      {
        user_name: "Adam",
        password: "pw",
        display_name: "Adam Display",
        email: "adam@gmail.com",
        gender: "M",
        age: "18",
      },
      {
        user_name: "Bob",
        password: "pw",
        display_name: "Bob Display",
        email: "bob@gmail.com",
        gender: "M",
        age: "19",
      },
      {
        user_name: "Cherry",
        password: "pw",
        display_name: "Cherry Display",
        email: "cherry@gmail.com",
        gender: "F",
        age: "21",
      },
    ])
    .returning("id");

  const eventType = await knex("event_type")
    .insert([
      {
        event_type: "reaction",
      },
      {
        event_type: "squat",
      },
      {
        event_type: "quickness",
      },
      {
        event_type: "backup",
      },
    ])
    .returning("id");

  await knex("events").insert([
    {
      points: "4",
      created_at: new Date("2020-02-20"),
      user_id: users[0],
      event_type_id: eventType[0],
    },
    {
      points: "2",
      created_at: new Date("2020-04-24"),
      user_id: users[1],
      event_type_id: eventType[0],
    },
    {
      points: "3",
      created_at: new Date("2020-04-29"),
      user_id: users[3],
      event_type_id: eventType[0],
    },
    {
      points: "8",
      created_at: new Date("2020-05-01"),
      user_id: users[2],
      event_type_id: eventType[1],
    },
    {
      points: "11",
      created_at: new Date("2020-05-01"),
      user_id: users[1],
      event_type_id: eventType[1],
    },
    {
      points: "5",
      created_at: new Date("2020-04-28"),
      user_id: users[4],
      event_type_id: eventType[2],
    },
    {
      points: "3",
      created_at: new Date("2020-05-01"),
      user_id: users[5],
      event_type_id: eventType[2],
    },
  ]);
}
