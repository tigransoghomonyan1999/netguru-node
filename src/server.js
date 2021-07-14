const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { authFactory, AuthError } = require("./auth");

const PORT = 3000;
const { JWT_SECRET } = process.env;

//creating options for swagger(API documentation)
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Movies API",
			version: "1.0.0",
			description: "A simple Express Movies API",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);

// connecting to cloud mongodb
const connectionString = `mongodb+srv://tigran:simplepassword@cluster0.k5r3q.mongodb.net/recruitment_task_database?retryWrites=true&w=majority`;
mongoose.connect(
	connectionString,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => console.log("Connection to mongoAtlas was adapted successfully...")
);

if (!JWT_SECRET) {
	throw new Error(
		"Missing JWT_SECRET env var. Set it and restart the server"
	);
}

// importing movies routes
const moviesRoutes = require("./routes/movies");

const auth = authFactory(JWT_SECRET);
const app = express();

app.use(bodyParser.json());

app.post("/auth", (req, res, next) => {
	if (!req.body) {
		return res.status(400).json({ error: "invalid payload" });
	}

	const { username, password } = req.body;

	console.log(req.body);

	if (!username || !password) {
		return res.status(400).json({ error: "invalid payload" });
	}

	try {
		const token = auth(username, password);

		return res.status(200).json({ token });
	} catch (error) {
		if (error instanceof AuthError) {
			return res.status(401).json({ error: error.message });
		}

		next(error);
	}
});

//handling all movie-related routes at one place
app.use("/movies", moviesRoutes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


app.use((error, _, res, __) => {
	console.error(
		`Error processing request ${error}. See next message for details`
	);
	console.error(error);

	return res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
	console.log(`auth svc running at port ${PORT}`);
});
