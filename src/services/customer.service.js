import axios from "axios";

export const customerGetTotal = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/customers/total`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetListService = async (activePage) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/customers/page/${activePage}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerGetService = async (_id) => {
  try {
    return await axios.get(`${window.$server_url}/admin/customers/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerAddService = async (customer) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/customers/add`,
      customer
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerDeleteService = async (_id) => {
  try {
    return await axios.delete(
      `${window.$server_url}/admin/customers/delete/${_id}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerUpdateService = async (id, customer) => {
  try {
    return await axios.patch(
      `${window.$server_url}/admin/customers/update/${id}`,
      customer
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerSearchService = async (req) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/customers/search`,
      req
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerAllCategoriesService = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/customers/categories`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerAllTagsService = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/customers/tags`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const customerAllAttributesService = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/customers/attributes`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
