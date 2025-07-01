import { Router, express } from "hyper-express";
import { resolveUserAgent } from "browserslist-useragent";
import compat from "core-js-compat";
import { build } from "esbuild";

//#region src/polyfill.ts
const parseMajorVersion = (version) => {
	const match = version.match(/^(\\d+)\\.*/);
	if (match == null) return version;
	return match[1];
};
const getPolyfillList = (userAgent) => {
	try {
		const { family, version } = resolveUserAgent(userAgent);
		return compat({
			targets: `${family} ${parseMajorVersion(version)}`,
			version: "3"
		}).list;
	} catch {
		return compat({
			targets: "IE >= 11",
			version: "3"
		}).list;
	}
};
const getPolyfillImportScript = (scripts) => {
	return scripts.map((script) => {
		return `
            import "core-js/modules/${script}"
        `;
	}).join("\n");
};
const getPolyfillScript = async (script) => {
	const result = await build({
		stdin: {
			contents: script,
			loader: "js",
			resolveDir: "."
		},
		minify: true,
		write: false,
		bundle: true,
		target: "es5",
		platform: "browser",
		format: "iife"
	});
	const { contents } = result.outputFiles[0];
	return contents;
};

//#endregion
//#region src/v1.ts
const router = new Router();
router.get("/", (req, res) => {
	res.send("Wavve Dynamic Polyfill API v1");
});
router.get("/polyfill.js", async (req, res) => {
	const userAgent = req.headers["user-agent"];
	const polyfillList = getPolyfillList(userAgent);
	const polyfillImportScript = getPolyfillImportScript(polyfillList);
	const polyfillScript = await getPolyfillScript(polyfillImportScript);
	res.type("application/javascript");
	res.send(polyfillScript);
});
var v1_default = router;

//#endregion
//#region src/main.ts
const app = express();
app.use("/api/v1", v1_default);
app.listen(3e3);

//#endregion