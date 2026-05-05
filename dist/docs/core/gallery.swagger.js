"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryDocs = void 0;
exports.galleryDocs = {
    "/gallery/{id}": {
        delete: {
            summary: "Delete a gallery image",
            description: "Deletes a gallery image owned by the authenticated user.",
            security: [{ bearerAuth: [] }],
            tags: ["Common"],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Gallery image ID",
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: { description: "Image deleted successfully" },
                401: { description: "Unauthorized" },
                403: { description: "Forbidden" },
                404: { description: "Gallery image not found" },
                500: { description: "Internal server error" }
            }
        }
    }
};
