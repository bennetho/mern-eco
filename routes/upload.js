const router = require("express").Router();
const cloudinary = require("cloudinary");
const fs = require("fs");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.post("/upload", auth, authAdmin, (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).send("No files were uploaded.");

    const file = req.files.file;
    if (file.size > 1024 * 1024)
      return res.status(400).json({ msg: "Size too large" });

    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg")
      return res.status(400).json({ msg: "File format is incorrect" });

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "ecommerce" },
      async (err, result) => {
        if (err) throw err;

        fs.unlink(file.tempFilePath, (err) => {
          if (err) throw err;
        });

        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/destroy", auth, authAdmin, (req, res) => {
  const { public_id } = req.body;
  if (!public_id) return res.status(400).json({ msg: "No Images Selected" });
  try {
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: "Deleted Image" });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

// const router = require("express").Router();
// const cloudinary = require("cloudinary");
// const fs = require("fs");
// const auth = require("../middleware/auth");
// const authAdmin = require("../middleware/authAdmin");

// // we will uploads our images in cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// // upload image
// router.post("/upload", (req, res) => {
//   try {
//     console.log(req.files);
//     res.json("test upload");
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });

// module.exports = router;
