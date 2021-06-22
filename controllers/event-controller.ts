import express from "express";
import { EventService } from "../services/event-service";

export class EventController {
  constructor(public eventService: EventService) {}

  getRanking = async (req: express.Request, res: express.Response) => {
    try {
      let type = req.query.type as string;
      // console.log({type})
      let ranking = await this.eventService.getRanking(type);
      console.log(ranking)
      res.json(ranking);
    } catch (error) {
      console.log(error);
      res.status(500).end("Failed to get ranking");
    }
  };

  postResult = async (req: express.Request, res: express.Response) => {
    try {
      console.log("req.body: ", req.body);
      console.log("req.session.user: ", req.session["user"]);
      let result = await this.eventService.postResult({
        points: req.body.points,
        user_id: req.session["user"].id,
        event_type: req.params.event_type,
      });
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).end("Failed to get ranking");
    }
  };
}
