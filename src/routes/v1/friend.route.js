const express = require('express');
const friendController = require('../../controllers/friend.controller');

const router = express.Router();

router.route('/friendship').post(friendController.createFriendship);

router.route('/:userId/list').get(friendController.getFriendsList);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friends management and retrieval
 */

/**
 * @swagger
 * /friends/friendship:
 *   post:
 *     summary: Create a friendship with an user
 *     description: Any user can create a friendship.
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - friendId
 *             properties:
 *               userId:
 *                 type: string
 *               friendId:
 *                 type: string
 *             example:
 *               userId: 0054fbd5-899a-4eee-9109-a136a2afcbd2,
 *               friendId: 0efc34b5-498d-418d-9907-2d3b5e1dd083
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /friends/{userId}/list:
 *   get:
 *     summary: Get friends list of an user
 *     description: Any user can retrieve friends list.
 *     tags: [Friends]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
