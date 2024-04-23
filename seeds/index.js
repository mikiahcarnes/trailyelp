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
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const trail = new Trail({
      author: "661e47a4071fb9150453a004",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dkj1iald3/image/upload/v1713847598/TrailYelp/hjgv1dzdej9ygrtxyfip.jpg",
          filename: "TrailYelp/hjgv1dzdej9ygrtxyfip",
        },
        {
          url: "https://res.cloudinary.com/dkj1iald3/image/upload/v1713847600/TrailYelp/kaohgngdzpi0hpfggtsc.jpg",
          filename: "TrailYelp/kaohgngdzpi0hpfggtsc",
        },
        {
          url: "https://res.cloudinary.com/dkj1iald3/image/upload/v1713847599/TrailYelp/hywq05st48ldu4r27eri.jpg",
          filename: "TrailYelp/hywq05st48ldu4r27eri",
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
