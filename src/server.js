import dotenv from "dotenv";
dotenv.config();

// 👇 import AFTER dotenv
const appModule = await import("./app.js");
const app = appModule.default;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});