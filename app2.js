const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");
const ejs = require("ejs");
const Photo = require("./models/Photo");
const path = require("path");
const fs = require("fs");

const app = express();
//connect DB
mongoose.connect("mongodb://localhost/pcat-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Template Engine
app.set("view engine", "ejs");

// middleware
// eklenen üçüncü parti middleware'lerin kullanılabilmesi için app.use() ile eklenmesi gerekir.
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

//Routes
app.get("/", async (req, res) => {
  const photos = await Photo.find({}).sort({ dateCreated: "desc" });
  res.render("index", { photos });
});
app.get("/photos/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", { photo });

  // res.render("about");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/add", (req, res) => {
  res.render("add");
});
app.get("/photos/edit/:id", async (req, res) => {
  const photo = await Photo.findOne({
    _id: req.params.id,
  });
  res.render("edit", { photo });
});
app.post("/photos", async (req, res) => {
  // await Photo.create(req.body);
  // res.redirect("/");
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadedImage.name;

  uploadedImage.mv(
    uploadPath,

    async () => {
      await Photo.create({
        ...req.body,
        image: "/uploads/" + uploadedImage.name,
      });
      res.redirect("/");
    }
  );
});

app.put("/photos/:id", async (req, res) => {
  //FindById sadece _id ye göre arar ve bulur. FindOne kullanırken name, title, detail, dateCreated ve o collection içinde her ne varsa ona göre aratıp eşleşen ilk kayıdı bulur.
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  // VEYA bu şekilde kullanılabilir
  //  const photo = await Photo.findByIdAndUpdate(req.params.id, req.body);
  // photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

app.delete("/photos/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + "/public" + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
