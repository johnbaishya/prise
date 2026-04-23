import { createProduct, updateProduct, addProductGalleryImages, getProductById, deleteProduct, listProducts, verifyProductOwnershipByProductId, verifyproductOfCompany, verifyProductOwnership, verifyProductCreationEligibilityForUser, verifyProductUpdateEligibilityForUser } from './product.service';
import Product from '../models/product.model';
import * as companyService from '@/core/company/company.service';
import * as productCategoryService from './productCategory.service';
import * as productTagService from './productTag.service';
import * as galleryService from '@/core/gallery/gallery.service';
import AppError from '@/libs/errorHandler';

jest.mock('../models/product.model');
jest.mock('@/core/company/company.service');
jest.mock('./productCategory.service');
jest.mock('./productTag.service');
jest.mock('@/core/gallery/gallery.service');

describe('Product Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('verifyProductOwnershipByProductId', () => {
        it('should throw error if product not found', async () => {
            (Product.findById as jest.Mock).mockResolvedValue(null);
            await expect(verifyProductOwnershipByProductId('userId', 'productId')).rejects.toThrow(AppError);
        });

        it('should throw error if user is not company owner', async () => {
            (Product.findById as jest.Mock).mockResolvedValue({ company: 'companyId' });
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);
            await expect(verifyProductOwnershipByProductId('userId', 'productId')).rejects.toThrow(AppError);
        });

        it('should verify ownership successfully', async () => {
            (Product.findById as jest.Mock).mockResolvedValue({ company: 'companyId' });
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            await expect(verifyProductOwnershipByProductId('userId', 'productId')).resolves.not.toThrow();
        });
    });

    describe('verifyproductOfCompany', () => {
        it('should throw error if product not found', async () => {
            (Product.findById as jest.Mock).mockResolvedValue(null);
            await expect(verifyproductOfCompany('productId', 'companyId')).rejects.toThrow();
        });

        it('should throw error if product does not belong to company', async () => {
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'otherCompanyId' } });
            await expect(verifyproductOfCompany('productId', 'companyId')).rejects.toThrow();
        });

        it('should verify product belongs to company successfully', async () => {
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            await expect(verifyproductOfCompany('productId', 'companyId')).resolves.not.toThrow();
        });
    });

    describe('verifyProductOwnership', () => {
        it('should throw error if product not found', async () => {
            (Product.findById as jest.Mock).mockResolvedValue(null);
            await expect(verifyProductOwnership('productId', 'userId')).rejects.toThrow();
        });

        it('should throw error if user is not company owner', async () => {
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);
            await expect(verifyProductOwnership('productId', 'userId')).rejects.toThrow();
        });

        it('should verify ownership successfully', async () => {
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            await expect(verifyProductOwnership('productId', 'userId')).resolves.not.toThrow();
        });
    });

    describe('verifyProductCreationEligibilityForUser', () => {
        it('should throw error if user is not company owner', async () => {
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(false);
            await expect(verifyProductCreationEligibilityForUser('userId', 'companyId', 'categoryId')).rejects.toThrow(AppError);
        });

        it('should throw error if category verification fails', async () => {
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            (productCategoryService.verifyProductCategoryofCompany as jest.Mock).mockRejectedValue(new Error('Category error'));
            await expect(verifyProductCreationEligibilityForUser('userId', 'companyId', 'categoryId')).rejects.toThrow();
        });

        it('should throw error if tag verification fails', async () => {
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            (productCategoryService.verifyProductCategoryofCompany as jest.Mock).mockResolvedValue(undefined);
            (productTagService.verifyProductTagOfCompany as jest.Mock).mockRejectedValue(new Error('Tag error'));
            await expect(verifyProductCreationEligibilityForUser('userId', 'companyId', 'categoryId', ['tagId'])).rejects.toThrow();
        });

        it('should verify eligibility successfully', async () => {
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            (productCategoryService.verifyProductCategoryofCompany as jest.Mock).mockResolvedValue(undefined);
            await expect(verifyProductCreationEligibilityForUser('userId', 'companyId', 'categoryId')).resolves.not.toThrow();
        });
    });

    describe('verifyProductUpdateEligibilityForUser', () => {
        it('should throw error if product not found', async () => {
            (Product.findById as jest.Mock).mockResolvedValue(null);
            await expect(verifyProductUpdateEligibilityForUser('userId', 'productId')).rejects.toThrow(AppError);
        });

        it('should throw error if user is not company owner', async () => {
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockRejectedValue(new Error('Not owner'));
            await expect(verifyProductUpdateEligibilityForUser('userId', 'productId')).rejects.toThrow();
        });

        it('should verify update eligibility successfully', async () => {
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            (companyService.checkCompanyOwnershipByCompanyId as jest.Mock).mockResolvedValue(true);
            (productCategoryService.verifyProductCategoryofCompany as jest.Mock).mockResolvedValue(undefined);
            await expect(verifyProductUpdateEligibilityForUser('userId', 'productId')).resolves.not.toThrow();
        });
    });

    describe('createProduct', () => {
        it('should create product successfully', async () => {
            const mockProduct = { _id: 'productId', toObject: () => ({ _id: 'productId', name: 'Product' }) };
            const mockGallery = [{ _id: 'galleryId' }];
            
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            jest.spyOn(productCategoryService, 'verifyProductCategoryofCompany').mockResolvedValue(undefined);
            (Product.create as jest.Mock).mockResolvedValue(mockProduct);
            (galleryService.addGalleryImages as jest.Mock).mockResolvedValue(mockGallery);

            const result = await createProduct({ name: 'Product', slug: 'product', companyId: 'companyId', productCategoryId: 'categoryId' , tags: [] ,price: 100}, 'userId', []);
            expect(result).toHaveProperty('gallery');
        });

        it('should throw error if verification fails', async () => {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(false);
            await expect(createProduct({ name: 'Product', slug: 'product', companyId: 'companyId', productCategoryId: 'categoryId' , tags: [] ,price: 100}, 'userId', [])).rejects.toThrow();
        });
    });

    describe('updateProduct', () => {
        it('should update product successfully', async () => {
            const mockProduct = { _id: 'productId', toObject: () => ({ _id: 'productId', name: 'Updated' }) };
            const mockGallery = [{ _id: 'galleryId' }];

            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            jest.spyOn(productCategoryService, 'verifyProductCategoryofCompany').mockResolvedValue(undefined);
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProduct);
            (galleryService.getGalleryImages as jest.Mock).mockResolvedValue(mockGallery);

            const result = await updateProduct('productId', { name: 'Updated' }, 'userId');
            expect(result).toBeDefined();
        });

        it('should throw error if product not found after update', async () => {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(updateProduct('productId', {}, 'userId')).rejects.toThrow(AppError);
        });
    });

    describe('addProductGalleryImages', () => {
        it('should add gallery images successfully', async () => {
            const mockGallery = [{ _id: 'galleryId' }];
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            (galleryService.addGalleryImages as jest.Mock).mockResolvedValue(mockGallery);

            const result = await addProductGalleryImages('productId', 'userId', []);
            expect(result).toEqual(mockGallery);
        });

        it('should throw error if user not authorized', async () => {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(false);
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });

            await expect(addProductGalleryImages('productId', 'userId', [])).rejects.toThrow();
        });
    });

    describe('getProductById', () => {
        it('should return product successfully', async () => {
            const mockProduct = { _id: 'productId', name: 'Product' };
            (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

            const result = await getProductById('productId');
            expect(result).toEqual(mockProduct);
        });

        it('should throw error if product not found', async () => {
            (Product.findById as jest.Mock).mockResolvedValue(null);
            await expect(getProductById('productId')).rejects.toThrow(AppError);
        });
    });

    describe('deleteProduct', () => {
        it('should delete product successfully', async () => {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(true);
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });
            (Product.findByIdAndDelete as jest.Mock).mockResolvedValue({});
            (galleryService.deleteMultipleGalleryImagesByEntityId as jest.Mock).mockResolvedValue(undefined);

            await expect(deleteProduct('productId', 'userId')).resolves.not.toThrow();
        });

        it('should throw error if user not authorized', async () => {
            jest.spyOn(companyService, 'checkCompanyOwnershipByCompanyId').mockResolvedValue(false);
            (Product.findById as jest.Mock).mockResolvedValue({ company: { toString: () => 'companyId' } });

            await expect(deleteProduct('productId', 'userId')).rejects.toThrow();
        });
    });

    describe('listProducts', () => {
        it('should list products with default filters', async () => {
            const mockProducts = [{ _id: 'productId', name: 'Product' }];
            (Product.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockProducts)
            });
            (Product.countDocuments as jest.Mock).mockResolvedValue(1);

            const result = await listProducts('companyId', {});
            expect(result.data).toEqual(mockProducts);
            expect(result.meta.page).toBe(1);
        });

        it('should list products with search filter', async () => {
            (Product.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });
            (Product.countDocuments as jest.Mock).mockResolvedValue(0);

            const result = await listProducts('companyId', { search: 'test' });
            expect(result.meta.total).toBe(0);
        });

        it('should list products with tag filter', async () => {
            (Product.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });
            (Product.countDocuments as jest.Mock).mockResolvedValue(0);

            await listProducts('companyId', { tag: 'tag1,tag2' });
            expect(Product.find).toHaveBeenCalled();
        });

        it('should list products with category filter', async () => {
            (Product.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });
            (Product.countDocuments as jest.Mock).mockResolvedValue(0);

            await listProducts('companyId', { category: 'categoryId' });
            expect(Product.find).toHaveBeenCalled();
        });

        it('should list products with pagination', async () => {
            (Product.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([])
            });
            (Product.countDocuments as jest.Mock).mockResolvedValue(50);

            const result = await listProducts('companyId', { page: 2, limit: 20 });
            expect(result.meta.totalPages).toBe(3);
        });
    });
});