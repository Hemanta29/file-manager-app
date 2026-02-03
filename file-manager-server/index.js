import express from "express";
import cors from "cors";
import multer from "multer";
import upload from "./services/upload.file.service.js";
import BinarySearchTree from "./schemas/tree.schema.js";
import errorHandler from "./utils/errorHandler.js";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const tree = new BinarySearchTree();

app.get("/", (req, res) => {
  res.send("File Manager Server is running");
});

app.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (
          err.code === "LIMIT_FILE_COUNT" ||
          err.code === "LIMIT_UNEXPECTED_FILE" ||
          err.code === "LIMIT_PART_COUNT" ||
          err.code === "LIMIT_FIELD_KEY" ||
          err.code === "LIMIT_FIELD_VALUE" ||
          err.code === "LIMIT_FIELD_COUNT"
        ) {
          return next(
            new errorHandler(
              `You are trying to upload too many files. Maximum allowed is 10 files`,
              400
            )
          );
        }
        return next(new errorHandler(err.message, 400));
      }
      return next(new errorHandler(`An Unknown error occured`, 500));
    }
    const files = req.files;
    if (!files || files.length === 0) {
      return next(
        new errorHandler("Please provide atleast a file to upload.", 400)
      );
    }
    files.forEach((file) => {
      tree.insert(file.originalname, {
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      });
    });
    const response = {
      success: true,
      message: `${files.length} File(s) uploaded successfully.`,
      files,
      data: tree.toJSON(),
    };
    res.send(response);
  });
});

app.get("/search", (req, res, next) => {
  const key = req.query.key;
  if (!key) {
    return next(new errorHandler("Please provide a search key", 400));
  }
  const result = tree.search(key);
  if (result) {
    res.json({
      success: true,
      message: "File found successfully",
      data: result,
    });
  } else {
    res.json({
      success: false,
      message: "File not found",
      data: null,
    });
  }
});

app.get("/viewTree", (req, res, next) => {
  res.json({
    success: true,
    message: "Tree fetched successfully",
    data: tree.toJSON(),
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const errorResponse = {
    success: false,
    message,
    status: statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
});

app.listen(port, () => {
  console.log(`File Manager Server is listening at http://localhost:${port}`);
});
