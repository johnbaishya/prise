import { checkOwnershipStatus } from "@/libs/auth";
import Company from "./company.model";
import { check } from "zod";
import { checkCompanyOwnershipByCompanyId } from "./company.service";


jest.mock("./company.model");
// jest.mock("@/libs/auth");

describe("checkCompanyOwnershipByCompanyId test", () => {

    it("should return false if company does not exist", async () => {
        const mockFindById = jest.fn().mockResolvedValue(null);
        (Company.findById as jest.Mock) = mockFindById;

        await expect(
            checkCompanyOwnershipByCompanyId("user1", "company1")
        ).rejects.toThrow("Company not found");
    });


    it("should return true if user is owner", async () => {
        const mockCompany = {
            get: jest.fn().mockReturnValue("owner123"),
        };

        (Company.findById as jest.Mock).mockResolvedValue(mockCompany);

        const result = await checkCompanyOwnershipByCompanyId(
            "owner123",
            "company1"
        );

        expect(result).toBe(true);
    });


    

    it("should return false if user is not owner", async () => {
        const mockCompany = {
            get: jest.fn().mockReturnValue("owner123"),
        };
        (Company.findById as jest.Mock).mockResolvedValue(mockCompany);

        const result = await checkCompanyOwnershipByCompanyId(
            "user456",
            "company1"
        );

        expect(result).rejects.toThrow("You are not authorized to perform this action");
    });
});