const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/download', (req, res) => {
  const videoURL = req.query.url;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  const videoInfo = ytdl.getInfo(videoURL);

  videoInfo.then(info => {
    res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    ytdl(videoURL, { format: 'mp4' }).pipe(res);
  }).catch(err => {
    console.error(err);
    res.status(500).send('Error fetching video information');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
