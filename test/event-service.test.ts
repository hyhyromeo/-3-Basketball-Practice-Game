import { knex } from "../db";
import { EventService } from "../services/event-service";

let eventService = new EventService(knex);
async function ranking() {
  let result = await eventService.getRanking("3pt");
  console.log(result);
}

ranking ()
