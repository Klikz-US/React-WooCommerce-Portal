import axios from "axios";

// Purchase Orders
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
    return await axios.put(
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

// Rental Quotes
export const rentalQuotesGetListService = async (activePage) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/orders/rentals/page/${activePage}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const rentalQuoteGetService = async (_id) => {
  try {
    return await axios.get(`${window.$server_url}/admin/orders/rentals/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const rentalQuotesSearchService = async (req) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/orders/rentals/search`,
      req
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

// Purchase Proposals
export const purchaseProposalsGetListService = async (activePage) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/orders/proposals/page/${activePage}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const purchaseProposalGetService = async (_id) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/orders/proposals/${_id}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const purchaseProposalsSearchService = async (req) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/orders/proposals/search`,
      req
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
