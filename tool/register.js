const sqlite3 = require("sqlite3");
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const { execSync } = require("child_process");
const readline = require("readline/promises");

const main = async(db) => {
  db.all("select uuid from contents", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readdir(process.env.RED_CABINET_ASSET, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      for (const file of files) {
        const dirPath = path.join(process.env.RED_CABINET_ASSET, file);
        if (!fs.statSync(dirPath).isDirectory()) {
          continue;
        }

        if (!rows.find(v => v.uuid === file)) {
          const uuid = file;
          fs.readdir(dirPath, async(err, files) => {
            if (err) {
              console.error(err);
              return;
            }

            if (files.length === 1 && /png$/.test(files[0])) {
              const fpath = path.join(dirPath, files[0]);
              const half = `half_${files[0]}`;
              const qt = `quarter_${files[0]}`;
              execSync(`${process.env.IMAGEMAGICK_CONVERT} ${fpath} -resize 50% ${path.join(dirPath, half)}`);
              execSync(`${process.env.IMAGEMAGICK_CONVERT} ${fpath} -resize 25% ${path.join(dirPath, qt)}`);
              files.push(half);
              files.push(qt);
            }

            const images = [];
            for (const file of files) {
              if (/thumb\.png/.test(file)) {
                continue;
              }
              if (/png$/.test(file)) {
                const s = sizeOf(path.join(dirPath, file));
                images.push({ name: file, w: s.width, h: s.height });
              }
            }
            const filesJson = JSON.stringify(images.sort((a, b) => ((a.w > b.w) && (a.h > b.h)) ? 1 : -1));

            console.log("dir:", uuid);
            const rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });
            const title = await rl.question("title? ");
            const description = await rl.question("description? ");
            const tagsJson = JSON.stringify((await rl.question("tags? ")).split(","));
            rl.close();

            db.all(
              `insert into contents(uuid, title, description, tags, files) values (?,?,?,?,?)`,
              [uuid, title, description, tagsJson, filesJson],
              (err, res) => {
                if (err) {
                  console.error(err);
                }
            });
          });
        }
      }
    });
  });
}

const db = new sqlite3.Database(process.env.SQLITE3_RED_CABINET);
process.on('exit', () => db.close());
process.on('SIGINT', () => db.close());
process.on('SIGUSR1', () => db.close());
process.on('SIGUSR2', () => db.close());
process.on('uncaughtException', () => db.close());
main(db);