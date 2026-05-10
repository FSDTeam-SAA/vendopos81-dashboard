// src/lib/services/categoryService.ts

import axiosInstance from '../instance/axios-instance';
import { CategoryParams, CreateRegionPayload } from '../types/category';

// Get All Categories
export const getAllCategories = async (params?: CategoryParams) => {
  try {
    const response = await axiosInstance.get('/category/get-all', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createRegionWithCategories = async (payload: CreateRegionPayload) => {
  try {
    const formData = new FormData();

    formData.append('region', payload.region);

    // region image
    if (payload.regionImage) {
      formData.append('regionImage', payload.regionImage, payload.regionImage.name);
    }

    payload.categories.forEach((cat, catIndex) => {
      formData.append(`categories[${catIndex}][productType]`, cat.productType);

      cat.productName.forEach((name, nameIndex) => {
        formData.append(`categories[${catIndex}][productName][${nameIndex}]`, name);
      });

      if (cat.productImage) {
        formData.append(
          `categories[${catIndex}][productTypeImage]`,
          cat.productImage,
          cat.productImage.name,
        );
      }
    });

    const response = await axiosInstance.post('/category/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating region with categories:', error);
    throw error;
  }
};

// Update Category
export const updateCategory = async (payload: unknown) => {
  try {
    // Narrow payload
    if (!payload || typeof payload !== 'object') throw new Error('Invalid payload');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = payload as any;

    // If caller provided a prepared FormData, use it directly. This is important
    // because some UI code (e.g. the modal) builds FormData with exact keys
    // and files; we should send that as-is.
    const formData: FormData = p.formData instanceof FormData ? p.formData : new FormData();

    // If no pre-built FormData was provided, construct it from payload
    if (!(p.formData instanceof FormData)) {
      // IMPORTANT: Ensure region is added correctly
      if (p.region) {
        formData.append('region', p.region);
      }

      // SAFE GUARD - ensure categories exists
      const categories = p.categories ?? [];

      categories.forEach((cat: unknown, index: number) => {
        if (!cat || typeof cat !== 'object') return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = cat as any;

        // Add product type
        if (c.productType) {
          formData.append(`categories[${index}][productType]`, String(c.productType));
        }

        // Handle productName - ensure it's an array
        const productNames: string[] = Array.isArray(c.productName)
          ? c.productName
          : c.productName
            ? [String(c.productName)]
            : [];

        productNames.forEach((name: string, nameIndex: number) => {
          if (name && name.trim()) {
            formData.append(`categories[${index}][productName][${nameIndex}]`, name);
          }
        });

        // Handle product image - only if it's a File object
        if (c.productImage instanceof File) {
          formData.append(
            `categories[${index}][productTypeImage]`,
            c.productImage,
            c.productImage.name,
          );
        }
      });

      // Handle region image
      if (p.regionImage instanceof File) {
        formData.append('regionImage', p.regionImage, p.regionImage.name);
      }
    }

    // Debug: explicitly check for regionImage in formData and log details
    try {
      let foundRegionImage = false;
      console.log('updateCategory - list formData keys (non-binary info):');
      for (const e of formData.entries()) {
        const key = String(e[0]);
        const val = e[1];
        if (key === 'regionImage') {
          foundRegionImage = true;
          if (val instanceof File) {
            console.log('updateCategory - regionImage File found in formData ->', {
              name: val.name,
              size: val.size,
              type: val.type,
            });
          } else {
            console.log('updateCategory - regionImage present but not a File:', val);
          }
        } else {
          console.log(
            'formData key:',
            key,
            val instanceof File ? `File(${(val as File).name})` : String(val),
          );
        }
      }
      console.log('updateCategory - regionImage present in formData?', foundRegionImage);
    } catch (err) {
      console.log('updateCategory - Failed to enumerate formData', err);
    }

    // Clear Content-Type for this request so the browser can set the multipart boundary.
    // axiosInstance has a default Content-Type of application/json; passing
    // undefined ensures axios does not override the header and the browser
    // will add the correct multipart/form-data; boundary automatically.
    const response = await axiosInstance.put(`/category/update/${p._id}`, formData);

    // Return the API body for consistency with other service functions
    return response.data;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
};

export const getAllRegions = async () => {
  try {
    const response = await axiosInstance.get('category/get-region');
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};
