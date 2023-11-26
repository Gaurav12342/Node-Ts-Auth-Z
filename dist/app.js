"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./router/user"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3004;
const password = process.env.PASSWORD;
const database = process.env.DATABASE_NAME;
const uri = `mongodb+srv://admin:${password}@my-app-cluster.cgli7sm.mongodb.net/${database}`;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(errorHandler_1.default);
mongoose_1.default.connect(uri).then(() => {
    console.log("Database connected successfully.");
});
app.use("/user", user_1.default);
app.listen(PORT, () => {
    console.log(`App is running on port http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
    res.send("<h1>App is connected.</h1>");
});
