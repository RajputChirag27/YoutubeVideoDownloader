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



app.get('/qualities', (req, res) => {
    const url = req.query.videoUrl;
    const downloadType = req.query.downloadType;
  
    ytdl.getInfo(url)
      .then(info => {
        const formats = info.formats;
        const filteredFormats = downloadType === 'video'
          ? ytdl.filterFormats(formats, 'videoonly')
          : ytdl.filterFormats(formats, 'audioonly');
  
        const qualities = filteredFormats.map(format => format.qualityLabel);
        res.json(qualities);
      })
      .catch(err => {
        console.error('Error fetching qualities:', err);
        res.status(500).send('Error fetching qualities');
      });
  });


app.get('/download', async (req, res) => {
    const url = req.query.videoUrl;
    const downloadType = req.query.downloadType;
    const quality = req.query.quality;
  
    ytdl.getInfo(url)
      .then(info => {
        const formats = info.formats;
        const filteredFormats = downloadType === 'video'
          ? ytdl.filterFormats(formats, 'videoandaudio')
          : ytdl.filterFormats(formats, 'audioonly');
  
        const format = ytdl.chooseFormat(filteredFormats, { quality });
  
        if (format) {
          res.setHeader('Content-Disposition', `attachment; filename="video.${format.container}"`);
          ytdl(url, { format })
            .pipe(res);
        } else {
          console.error('No format found with the specified quality');
          res.status(500).send('Error: No format found with the specified quality');
        }
      })
      .catch(err => {
        console.error('Error fetching video info:', err);
        res.status(500).send('Error fetching info');
      });
  });

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
