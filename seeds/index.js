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
      author: "661e47a4071fb9150453a004",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dkj1iald3/image/upload/v1713769840/TrailYelp/ageztxqbzvtejnumdrhs.jpg",
          filename: "TrailYelp/ageztxqbzvtejnumdrhs",
        },
        {
          url: "https://res.cloudinary.com/dkj1iald3/image/upload/v1713769841/TrailYelp/dxq0p4hdotltnqcoh1sv.jpg",
          filename: "TrailYelp/dxq0p4hdotltnqcoh1sv",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, consequatur provident, eaque id esse corporis reiciendis veniam vitae cumque explicabo dolor quam ullam nulla odit debitis accusamus, sequi odio iusto!",
    });
    await trail.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
