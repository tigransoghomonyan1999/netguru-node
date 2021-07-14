const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");


const MoviesController = require("../controller/movies");

/**
*@swagger
* components:
*   schemas:
*     Movies:
*       type: object
*       properties:
*         _id:
*           type: string
*           description: The auto-generated mongoose ID
*         title:
*           type: string
*           description: The title of the movie
*         id:
*           type: number
*           description: auto-incrementing ID for sorting purposes
*         creatorId:
*           type: string
*           description: movie's creator ID
*         released:
*           type: string
*           description: movie's release date
*         genre:
*           type: string
*           description: movie's genre
*         director:
*           type: string
*           description: movie's director
*         creationRestrictionCounter:
*           type: number
*           description: for restricting basic user's movie creation
*       example:
*         _id: 60ef17973e4eeeddea9b24fe
*         id: 1
*         creatorId: 434
*         title: John Wick
*         released: 24 Oct 2014
*         genre: Action, Crime, Thriller
*         director: Chad Stahelski, David Leitch
*         creationRestrictionCounter: 1
*
*/


/**
* @swagger
* tags:
*   name: Movies
*   description: The Movies managing API
* 
*/



/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Creates a movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movies'
 *     responses:
 *       200:
 *         description: The Movie was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal Server Error
 */

router.post("/", checkAuth, MoviesController.create_movie);

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Returns all the movies that was created by the user
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Movies that created the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Internal Server Error
 */

router.get("/", checkAuth, MoviesController.movies_get);

module.exports = router;
