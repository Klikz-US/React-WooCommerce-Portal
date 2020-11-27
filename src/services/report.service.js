import axios from "axios";

export const reportGetSales = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/sales`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetTopSellers = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/sellers`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetCoupons = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/coupons`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetCustomers = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/customers`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetOrders = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/orders`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetProducts = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/products`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetReviews = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/reviews`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetSystem = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/system`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetTax = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/tax`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const reportGetShipping = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/reports/shipping`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
