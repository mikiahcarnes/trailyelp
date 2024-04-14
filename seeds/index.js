const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Trail = require("../models/trail");

mongoose.connect("mongodb://localhost:27017/trail-camp");

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Trail.deleteMany({});
  for (let i = 0; i < 51; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const trail = new Trail({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/9326439",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, consequatur provident, eaque id esse corporis reiciendis veniam vitae cumque explicabo dolor quam ullam nulla odit debitis accusamus, sequi odio iusto!",
    });
    await trail.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
