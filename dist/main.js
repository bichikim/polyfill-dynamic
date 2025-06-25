import { Router, express } from "hyper-express";

//#region src/v1.ts
const router = new Router();
router.get("/", (req, res) => {
	res.send("Hello World?");
});
var v1_default = router;

//#endregion
//#region src/main.ts
const app = express();
app.use("/api/v1", v1_default);
app.listen(3e3);

//#endregion