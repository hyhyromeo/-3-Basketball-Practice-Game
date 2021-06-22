import { Knex } from "knex";

type NewEvent = {
  points: number;
  user_id: number;
  event_type: string;
};

export class EventService {
  constructor(private knex: Knex) {}

  async getRanking(type: string) {
    return this.knex
      .select(
        "points",
        "user_name",
        "display_name",
        "email",
        "profile_pic",
        this.knex.raw("row_number() over (order by points desc) as rank")
      )
      .from("events")
      .innerJoin("event_type", "event_type_id", "event_type.id")
      .innerJoin("users", "events.user_id", "users.id")
      .where("event_type.event_type", type)
      .orderBy("points", "desc")
      .limit(6);
  }

  async postResult(event: NewEvent) {
    let event_type_id = this.knex
      .select("id")
      .from("event_type")
      .where({ event_type: event.event_type });
    await this.knex
      .insert({
        event_type_id: event_type_id,
        points: event.points,
        user_id: event.user_id,
      })
      .into("events");
    console.log({ event });
  }
}
