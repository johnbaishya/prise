import { UserRequest } from "@/Types/request";
import * as galleryService from "./gallery.service";
import { sendErrorResponse, sendSuccessResponse } from "@/libs/reqest";
import { Response } from "express";

/**
 * @swagger
 * /gallery/{id}:
 *   delete:
 *     summary: Delete a gallery image
 *     description: Deletes a gallery image owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Common
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Gallery image ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gallery image not found
 *       500:
 *         description: Internal server error
 */
// To delete a gallery image with ownership check
export const deleteGallery = async (req: UserRequest, res: Response) => {
    try {
        const galleryId = req.params.id;
        const userId = req.user?.id!;
        await galleryService.deleteGalleryImageAfterUserVerification(galleryId, userId);
        sendSuccessResponse(res, { message: "Image deleted successfully" });
    } catch (error: any) {
        sendErrorResponse(res, error);
    }
}