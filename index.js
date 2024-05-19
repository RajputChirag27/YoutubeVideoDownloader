const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get('/qualities', async (req, res) => {
  try {
    const url = req.query.videoUrl;
    const downloadType = req.query.downloadType;
    const info = await ytdl.getInfo(url);
    const formats = info.formats;

    let filteredFormats;
    if (downloadType === 'videoandaudio') {
      filteredFormats = ytdl.filterFormats(formats, 'videoandaudio');
    } else if (downloadType === 'videoonly') {
      filteredFormats = ytdl.filterFormats(formats, 'videoonly');
    } else {
      filteredFormats = ytdl.filterFormats(formats, 'audioonly');
    }

    const qualities = filteredFormats
      .map(format => ({
        qualityLabel: downloadType.includes('video') ? format.qualityLabel : `${format.audioBitrate} kbps`,
        itag: format.itag
      }))
      .filter(quality => quality.qualityLabel);

    res.json(qualities);
  } catch (err) {
    console.error('Error fetching qualities:', err);
    res.status(500).send('Error fetching qualities');
  }
});

app.get('/download', async (req, res) => {
  try {
    const url = req.query.videoUrl;
    const downloadType = req.query.downloadType;
    const itag = req.query.itag;
    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, { quality: itag });

    if (format) {
      res.setHeader('Content-Disposition', `attachment; filename="${downloadType.includes('video') ? 'video.' + format.container : 'audio.' + format.container}"`);
      ytdl(url, { format }).pipe(res);
    } else {
      console.error('No format found with the specified quality');
      res.status(500).send('Error: No format found with the specified quality');
    }
  } catch (err) {
    console.error('Error fetching video info:', err);
    res.status(500).send('Error fetching info');
  }
});
const port = 3000;
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
