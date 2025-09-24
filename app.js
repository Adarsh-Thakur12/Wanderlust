const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const { request } = require("http");
const ejsmate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to server");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(8080, () => {
  console.log("Server is listening the request");
});
//Index Route
app.get("/listing", async (req, res) => {
  const listing = await Listing.find();
  res.render("listings/index.ejs", { listing });
});

//Create Route
app.post("/listings", async (req, res) => {
  let newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listing");
});

//Edit Route
app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});
//Show Route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Root Route
app.get("/", (req, res) => {
  console.log("This is Root");
  res.send("Working");
});

//Update Route
app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.nlisting });
  res.redirect(`/listing/${id}`);
});

//Delete Route
app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});
