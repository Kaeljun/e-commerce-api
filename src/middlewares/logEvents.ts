import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

export const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fs.promises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fs.promises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

export const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.headers.origin}\t${req.url}\t${req.user}\t${req.body}`,
    "reqLog.txt"
  );
  console.log(
    `${req.method} ${req.path} ${req.user} ${req.body} ${res.status}`
  );
  next();
};
