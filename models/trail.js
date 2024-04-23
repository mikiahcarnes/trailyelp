const mongoose = require("mongoose");
const review = require("./review");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// ImageSchema.virtual("cardImage").get(function () {
//   return this.url.replace("/upload", "/upload/ar_16:9,c_crop");
// });

const opts = { toJSON: { virtuals: true } };

const TrailSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

TrailSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/trails/${this._id}">${this.title}</a></strong>
          <p>${this.description.substring(0, 20)}...</p>`;
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
