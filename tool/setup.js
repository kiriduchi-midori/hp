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
    row.created_at = `${new Date(`${row.created_at}z`).toLocaleDateString('sv')} ${new Date(`${row.created_at}z`).toLocaleTimeString('sv')}`;
    if (row.updated_at) {
      row.updated_at = `${new Date(`${row.updated_at}z`).toLocaleDateString('sv')} ${new Date(`${row.updated_at}z`).toLocaleTimeString('sv')}`;
    }
    res.push(row);
  }

  fs.writeFileSync(path.join(process.env.RED_CABINET_ASSET, "doodle.json"), JSON.stringify(res));
});

db.close();
