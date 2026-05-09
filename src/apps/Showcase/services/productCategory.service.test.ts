import {
  getProductCategoryWithOwnershipAndExistance,
  createProductCategory,
  updateProductCategory
} from "./productCategory.service";

import ProductCategory from "../models/productCategory.model";
import { createProductCategoryDTO, updateProductCategoryDTO } from "@/Types/request/showcase-request";
import { checkCompanyOwnershipByCompanyId } from "@/core/company/company.service";

jest.mock("../models/productCategory.model");
jest.mock("@/libs/auth");
jest.mock("@/core/company/company.service");
jest.mock("@/apps/Showcase/services/productCategory.service");



describe("getProductCategoryWithOwnershipAndExistance", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw 404 if product category not found", async () => {
    (ProductCategory.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      getProductCategoryWithOwnershipAndExistance("1", "user1")
    ).rejects.toThrow("Product category not found");
  });

  it("should throw 403 if user is not owner", async () => {
    (ProductCategory.findById as jest.Mock).mockResolvedValue({
      company_id: "company1",
    });

    (checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);

    await expect(
      getProductCategoryWithOwnershipAndExistance("1", "user1")
    ).rejects.toThrow("You are not authorized");
  });

  it("should return product category if owner", async () => {
    const mockCategory = { company_id: "company1" };

    (ProductCategory.findById as jest.Mock).mockResolvedValue(mockCategory);
    (checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);

    const result = await getProductCategoryWithOwnershipAndExistance("1", "user1");

    expect(result).toBe(mockCategory);
  });

});






describe("createProductCategory test", () => {

  it("should throw 403 if user is not owner of company", async () => {
        (checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);

        let inputData:createProductCategoryDTO = { 
            name: "Category 1", 
            companyId: "company1" ,
            slug:"category-1",
            description:"This is a sample product category"
        };
        await expect(
            createProductCategory(inputData, "user1")
        ).rejects.toMatchObject({status:403});
    });




    it("should create product category if user is owner", async () => {

        let inputData:createProductCategoryDTO = { 
            name: "Category 1", 
            companyId: "company1" ,
            slug:"category-1",
            description:"This is a sample product category"
        };
        const mockCategory = { name: "Category 1", companyId: "company1" };
        (checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
        (ProductCategory.create as jest.Mock).mockResolvedValue(mockCategory);

        const result = await createProductCategory(inputData, "user1");

        expect(result).toBe(mockCategory);
    });




});














describe("updateProductCategory Test",()=>{

    it("should throw 403 if user is not owner of company", async () => {
        (checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);

        let inputData:updateProductCategoryDTO = { 
            name: "Category 1", 
            slug:"category-1",
            description:"This is a sample product category"
        };
        await expect(
            updateProductCategory("1", inputData, "user1")
        ).rejects.toMatchObject({status:403});
    });


    it("should update product category if user is owner", async () => {

        let inputData:updateProductCategoryDTO = { 
            name: "Category 1", 
            slug:"category-1",
            description:"This is a sample product category"
        };
        const mockCategory = { name: "Category 1", company_id: "company1" };
        (checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
        (ProductCategory.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockCategory);

        const result = await updateProductCategory("1", inputData, "user1");

        expect(result).toBe(mockCategory);
    });

})