const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//connect DB
mongoose.connect("mongodb://localhost/pcat-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model("Photo", PhotoSchema);

//create document
// Photo.create({
//   title: "My second photo",
//   description: "This is my second photo",
// });

//read document
// Photo.find({}).then((data) => {
//   console.log(data);
// });

//update document
const id = "64349439f7acd3bbbbc284a9";
// Photo.findByIdAndUpdate(id, {
//   title: "My third photo",
//   description: "This is my third photo",
// }).then((data) => {
//   console.log(data);
// });

//delete document
Photo.findByIdAndDelete(id).then((data) => {
  console.log(data);
});
