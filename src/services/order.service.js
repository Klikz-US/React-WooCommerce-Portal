import axios from "axios";

export const orderGetTotal = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/orders/total`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderGetListService = async (activePage) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/orders/page/${activePage}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderGetService = async (_id) => {
  try {
    return await axios.get(`${window.$server_url}/admin/orders/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderAddService = async (order) => {
  try {
    return await axios.post(`${window.$server_url}/admin/orders/add`, order);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderDeleteService = async (_id) => {
  try {
    return await axios.delete(
      `${window.$server_url}/admin/orders/delete/${_id}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderUpdateService = async (id, order) => {
  try {
    return await axios.patch(
      `${window.$server_url}/admin/orders/update/${id}`,
      order
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderSearchService = async (req) => {
  try {
    return await axios.post(`${window.$server_url}/admin/orders/search`, req);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderAllCategoriesService = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/orders/categories`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderAllTagsService = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/orders/tags`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const orderAllAttributesService = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/orders/attributes`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
