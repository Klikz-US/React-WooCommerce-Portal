import axios from "axios";

export const productGetTotal = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/products/total`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productGetListService = async (activePage) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/products/page/${activePage}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productGetService = async (_id) => {
  try {
    return await axios.get(`${window.$server_url}/admin/products/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productGetVariantsService = async (_id) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/products/${_id}/variations`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productUpdateVariantsService = async (_id, variants) => {
  try {
    return await axios.patch(
      `${window.$server_url}/admin/products/${_id}/variations/update`,
      { variants: variants }
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productCreateVariantsService = async (_id, variants) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/products/${_id}/variations/create`,
      { variants: variants }
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productAddService = async (product) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/products/add`,
      product
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productDeleteService = async (_id) => {
  try {
    return await axios.delete(
      `${window.$server_url}/admin/products/delete/${_id}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productUpdateService = async (id, product) => {
  try {
    return await axios.patch(
      `${window.$server_url}/admin/products/update/${id}`,
      product
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productSearchService = async (req) => {
  try {
    return await axios.post(`${window.$server_url}/admin/products/search`, req);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productAllCategoriesService = async () => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/products/categories/all`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productAllTagsService = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/products/tags/all`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productAllAttributesService = async () => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/products/attributes/all`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const productPhotoAddService = async (photo) => {
  try {
    return await axios.post(`${window.$server_url}/admin/photos/add`, photo);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
