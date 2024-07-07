const sqlite3 = require("sqlite3");
const fs = require("fs");
const path = require("path");

const db = new sqlite3.Database(process.env.SQLITE3_RED_CABINET);
const res = [];

db.all("select * from contents order by created_at desc", (err, rows) => {
  if (err) {
    console.error(err);
    return;
  }

  for (const row of rows) {
    row.files = JSON.parse(row.files);
    row.tags = JSON.parse(row.tags);
    res.push(row);
  }

  fs.writeFileSync(path.join("public", "data", "doodle.json"), JSON.stringify(res));
});

db.close();
