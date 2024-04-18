const mongoose = require("mongoose");
const review = require("./review");
const { Schema } = mongoose;

const TrailSchema = new Schema({
  title: String,
  image: String,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

TrailSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Trail", TrailSchema);
