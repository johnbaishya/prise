import ProductTag from "../models/productTag.model";
import * as productTagService from "./productTag.service";
import * as companyService from "@/core/company/company.service";

jest.mock("@/core/company/company.service");
jest.mock("../models/productTag.model");

describe("productTag.service", () => {
    const mockUserId = "user123";
    const mockCompanyId = "company123";
    const mockProductTagId = "tag123";
    const mockProductTag = {
        _id: mockProductTagId,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic products",
        company_id: mockCompanyId,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("checkProductTagExists", () => {
        it("should return true if product tag exists", async () => {
            (ProductTag.findById as jest.Mock).mockResolvedValue(mockProductTag);
            const result = await productTagService.checkProductTagExists(mockProductTagId);
            expect(result).toBe(true);
            expect(ProductTag.findById).toHaveBeenCalledWith(mockProductTagId);
        });

        it("should return false if product tag does not exist", async () => {
            (ProductTag.findById as jest.Mock).mockResolvedValue(null);
            const result = await productTagService.checkProductTagExists(mockProductTagId);
            expect(result).toBe(false);
        });

        it("should throw error on database failure", async () => {
            (ProductTag.findById as jest.Mock).mockRejectedValue(new Error("DB Error"));
            await expect(productTagService.checkProductTagExists(mockProductTagId)).rejects.toThrow("DB Error");
        });
    });

    describe("getProductTagWithOwnershipAndExistance", () => {
        it("should return product tag if exists and user is owner", async () => {
            (ProductTag.findById as jest.Mock).mockResolvedValue(mockProductTag);
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);

            const result = await productTagService.getProductTagWithOwnershipAndExistance(mockProductTagId, mockUserId);
            expect(result).toEqual(mockProductTag);
        });

        it("should throw 404 if product tag not found", async () => {
            (ProductTag.findById as jest.Mock).mockResolvedValue(null);
            await expect(productTagService.getProductTagWithOwnershipAndExistance(mockProductTagId, mockUserId)).rejects.toMatchObject({
                message: "Product tag not found",
                status: 404,
            });
        });

        it("should throw 403 if user is not owner", async () => {
            (ProductTag.findById as jest.Mock).mockResolvedValue(mockProductTag);
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);

            await expect(productTagService.getProductTagWithOwnershipAndExistance(mockProductTagId, mockUserId)).rejects.toMatchObject({
                message: "You are not authorized to access this product tag",
                status: 403,
            });
        });
    });

    describe("createProductTag", () => {
        it("should create product tag if user is owner", async () => {
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            (ProductTag.create as jest.Mock).mockResolvedValue(mockProductTag);

            const result = await productTagService.createProductTag(
                { companyId: mockCompanyId, name: "Electronics", slug: "electronics", description: "Electronic products" },
                mockUserId
            );
            expect(result).toEqual(mockProductTag);
            expect(ProductTag.create).toHaveBeenCalled();
        });

        it("should throw 403 if user is not owner", async () => {
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);

            await expect(
                productTagService.createProductTag(
                    { companyId: mockCompanyId, name: "Electronics", slug: "electronics", description: "Electronic products" },
                    mockUserId
                )
            ).rejects.toMatchObject({
                message: "You are not authorized to create a product tag for this company",
                status: 403,
            });
        });
    });

    describe("updateProductTag", () => {
        it("should update product tag if user is owner", async () => {
            const updatedTag = { ...mockProductTag, name: "Updated" };
            (ProductTag.findById as jest.Mock).mockResolvedValue(mockProductTag);
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            (ProductTag.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTag);

            const result = await productTagService.updateProductTag(mockProductTagId, { name: "Updated" }, mockUserId);
            expect(result).toEqual(updatedTag);
            expect(ProductTag.findByIdAndUpdate).toHaveBeenCalledWith(mockProductTagId, { name: "Updated" }, { new: true });
        });

        it("should throw error if user is not authorized", async () => {
            (ProductTag.findById as jest.Mock).mockResolvedValue(mockProductTag);
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);

            await expect(productTagService.updateProductTag(mockProductTagId, { name: "Updated" }, mockUserId)).rejects.toMatchObject({
                status: 403,
            });
        });
    });

    describe("deleteProductTag", () => {
        it("should delete product tag if user is owner", async () => {
            (ProductTag.findById as jest.Mock).mockResolvedValue(mockProductTag);
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            (ProductTag.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProductTag);

            const result = await productTagService.deleteProductTag(mockProductTagId, mockUserId);
            expect(result).toEqual(mockProductTag);
            expect(ProductTag.findByIdAndDelete).toHaveBeenCalledWith(mockProductTagId);
        });

        it("should throw 404 if product tag not found", async () => {
            (ProductTag.findById as jest.Mock).mockResolvedValue(null);

            await expect(productTagService.deleteProductTag(mockProductTagId, mockUserId)).rejects.toMatchObject({
                status: 404,
            });
        });
    });

    describe("getProductTagsByCompanyId", () => {
        it("should return product tags for valid company", async () => {
            (companyService.checkifCompanyExists as jest.Mock).mockResolvedValue(true);
            (ProductTag.find as jest.Mock).mockResolvedValue([mockProductTag]);

            const result = await productTagService.getProductTagsByCompanyId(mockCompanyId);
            expect(result).toEqual([mockProductTag]);
            expect(ProductTag.find).toHaveBeenCalledWith({ company_id: mockCompanyId });
        });

        it("should throw 404 if company does not exist", async () => {
            (companyService.checkifCompanyExists as jest.Mock).mockResolvedValue(false);

            await expect(productTagService.getProductTagsByCompanyId(mockCompanyId)).rejects.toMatchObject({
                message: "Company not found",
                status: 404,
            });
        });
    });
});