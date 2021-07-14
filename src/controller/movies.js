const fetch = require("node-fetch");
const mongoose = require("mongoose");

const Movies = require("../model/movies");

exports.movies_get = async function (req, res, next) {
	const movies = await Movies.find({ creatorId: req.userData.userId });
	if (movies.length > 0) {
		return res.status(200).json({
			movies: movies,
		});
	} else {
		return res.status(200).json({
			message: "There is no movies created by the user",
		});
	}
};

exports.create_movie = async function (req, res, next) {
	let basicUserCreationCounter = 1;
	if (req.userData.role == "basic") {
		let currentMonth = new Date().toISOString().split("-")[1];
		const movies = await Movies.find(
			{ creatorId: req.userData.userId },
			[
				"_id",
				"id",
				"title",
				"creatorId",
				"released",
				"genre",
				"director",
				"createAt",
                "creationRestrictionCounter"
			],
			{ sort: { id: -1 } }
		);
		if (movies.length > 0) {
			const lastMovieCreationMonth = new Date(movies[0].createAt)
				.toISOString()
				.split("-")[1];
			if (
				currentMonth === lastMovieCreationMonth &&
				movies[0].creationRestrictionCounter == 5
			) {
				return res.status(402).json({
					message: "You have already created 5 movies this month",
				});
			} else if (currentMonth === lastMovieCreationMonth) {
                basicUserCreationCounter =
					+movies[0].creationRestrictionCounter + 1;
			}
		}
	}
	const title = req.body.title;
	const omdbResponse = await fetch(
		`http://www.omdbapi.com/?apikey=c7b9f3c5&t=${title}`
	);
	if (omdbResponse.ok) {
		const omdbMovie = await omdbResponse.json();
		let movie;
		if (req.userData.role == "basic") {
			movie = new Movies({
				_id: mongoose.Types.ObjectId(),
				creatorId: req.userData.userId,
				title: omdbMovie.Title,
				released: omdbMovie.Released,
				genre: omdbMovie.Genre,
				director: omdbMovie.Director,
				creationRestrictionCounter: basicUserCreationCounter,
			});
		} else {
			movie = new Movies({
				_id: mongoose.Types.ObjectId(),
				creatorId: req.userData.userId,
				title: omdbMovie.Title,
				released: omdbMovie.Released,
				genre: omdbMovie.Genre,
				director: omdbMovie.Director,
			});
		}
		const result = await movie.save();
		return res.status(200).json({
			movie: result,
		});
	} else {
		return res.status(404).json({
			message: "Movie not found in https://omdbapi.com/",
		});
	}
};
