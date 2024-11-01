import express from "express";
import { OK } from "./util";

const router = express.Router();

router.get("/hello", (_, res) => {
  return res
    .status(OK)
    .send('<p>"We live in a twilight world...<br />- The Protagonist"</p>');
});

router.get("/*", (_, res) => {
  return res.status(OK).json({ data: { message: "Hello world!" } });
});

export default router;
