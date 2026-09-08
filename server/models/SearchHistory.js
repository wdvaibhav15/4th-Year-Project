import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: String,
      default: null,
    },

    originalMessage: {
      type: String,
      required: true,
      trim: true,
    },

    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    resultCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SearchHistory =
  mongoose.models.SearchHistory ||
  mongoose.model(
    "SearchHistory",
    searchHistorySchema
  );

export default SearchHistory;