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

            console.log("dir:", uuid);
            const rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });
            const title = await rl.question("title? ") || null;
            const description = await rl.question("description? ") || null;
            let nsfw = await rl.question("nsfw? set 0 or 1; default is 0 ");
            if (nsfw !== "0" && nsfw !== "1") {
              console.log("0 is selected");
              nsfw = "0";
            }
            const otype = await rl.question("illust(i) or manga(m)? set 'i' or 'm'; default is 'i' ");
            let object_type = "illust";
            if (otype === "m") {
              object_type = "manga";
            }
            else if (otype !== "i") {
              console.log("set 'i' or 'm' for object_type; 'i' is selected");
            }
            const tagsJson = JSON.stringify((await rl.question("tags? ")).split(","));
            rl.close();

            let thumb = null;
            let filesJson = "";

            if (object_type === "illust") {
              const mainAndThumb = files.length === 2 && files.find(v => v === "thumb.png");
              const oneFile = files.length === 1 && files.find(v => v !== "thumb.png");
              const f = files.find(v => v !== "thumb.png");
              if ((oneFile || mainAndThumb) && /png$/.test(f)) {
                const fpath = path.join(dirPath, f);
                const half = `half_${f}`;
                const qt = `quarter_${f}`;
                execSync(`${process.env.IMAGEMAGICK_CONVERT} ${fpath} -resize 50% ${path.join(dirPath, half)}`);
                execSync(`${process.env.IMAGEMAGICK_CONVERT} ${fpath} -resize 25% ${path.join(dirPath, qt)}`);
                files.push(half);
                files.push(qt);
              }

              const images = [];
              for (const file of files) {
                if (/thumb\.png/.test(file)) {
                  thumb = "thumb.png";
                  continue;
                }
                if (/png$/.test(file)) {
                  const s = sizeOf(path.join(dirPath, file));
                  images.push({ name: file, w: s.width, h: s.height });
                }
              }
              filesJson = JSON.stringify(images.sort((a, b) => ((a.w > b.w) && (a.h > b.h)) ? 1 : -1));
            }
            else if (object_type === "manga") {
              const l = [], m = [], s = [];
              for (const file of files) {
                if (/thumb\.png/.test(file)) {
                  thumb = "thumb.png";
                  continue;
                }
                if (/png$/.test(file)) {
                  const fpath = path.join(dirPath, file);
                  const half = `half_${file}`;
                  const qt = `quarter_${file}`;
                  execSync(`${process.env.IMAGEMAGICK_CONVERT} ${fpath} -resize 50% ${path.join(dirPath, half)}`);
                  execSync(`${process.env.IMAGEMAGICK_CONVERT} ${fpath} -resize 25% ${path.join(dirPath, qt)}`);
                  const sl = sizeOf(path.join(dirPath, file));
                  const sm = sizeOf(path.join(dirPath, half));
                  const ss = sizeOf(path.join(dirPath, qt));
                  l.push({ name: file, w: sl.width, h: sl.height });
                  m.push({ name: half, w: sm.width, h: sm.height });
                  s.push({ name: qt, w: ss.width, h: ss.height });
                }
              }
              filesJson = JSON.stringify({ l: l, m: m, s: s });
            }

            db.all(
              `insert into contents(uuid, title, description, tags, files, thumb, nsfw, object_type) values (?,?,?,?,?,?,?,?)`,
              [uuid, title, description, tagsJson, filesJson, thumb, parseInt(nsfw, 10), object_type],
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
main(db);