const express = require("express");
const router = express.Router();

const ArtistModel = require("./../model/Artist");
const AlbumModel = require("./../model/Album");
const LabelModel = require("./../model/Label");
const StyleModel = require("./../model/Style");

/* GET home page. */

router.get("/", async (req, res, next) => {
  try {
    const lastArtists = await ArtistModel.find()
      .sort({ createdAt: -1 })
      .limit(3);

    const lastAlbums = await AlbumModel.find().sort({ createdAt: -1 }).limit(3);

    res.render("index", {
      lastArtists,
      lastAlbums,
    });
  } catch (err) {
    next(err);
  }
});

/* GET dashboard page  */

router.get("/dashboard", async (req, res, next) => {
  try {
    const dbRes = await Promise.all([
      ArtistModel.find(),
      LabelModel.find(),
      StyleModel.find(),
    ]);

    res.render("dashboard/index", {
      artistsCount: dbRes[0].length,
      labelsCount: dbRes[1].length,
      stylesCount: dbRes[2].length,
    });
  } catch (dbErr) {
    next(err);
  }
});

router.get("/artist", async (req, res, next) => {
  try {
    res.render("artists", {
      artists: await ArtistModel.find().populate("style"),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/album", async (req, res, next) => {
  try {
    res.render("albums", {
      albums: await AlbumModel.find().populate("artist label"),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/albums/:id", async (req, res, next) => {
  try {
    res.render(
      "album",
      await AlbumModel.findById(req.params.id).populate("artist label")
    );
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  // req.body (posted infos)
  // req.params (variable/dynamique part of a route path)
  // req.query (access infos from for with get method)
  try {
    console.log(req.query); // query strings
    const exp = new RegExp(req.query.search); // creating a regular expression
    const matchedArtists = await ArtistModel.find({ name: { $regex: exp } });
    const matchedAlbums = await AlbumModel.find({ title: { $regex: exp } });
    const matchedLabels = await LabelModel.find({ name: { $regex: exp } });
    const matchedStyles = await StyleModel.find({ name: { $regex: exp } });

    res.json({
      matchedArtists,
      matchedAlbums,
      matchedLabels,
      matchedStyles,
    });
  } catch (err) {
    next(err);
  }
});


router.get('/profile', (req, res, next)=>{
  res.render("profile")
})




module.exports = router; // MANDATORY
