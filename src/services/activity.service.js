import axios from "axios";

export const activityGetTotal = async () => {
  try {
    return await axios.get(`${window.$server_url}/admin/activities/total`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const activityGetListService = async (activePage) => {
  try {
    return await axios.get(
      `${window.$server_url}/admin/activities/page/${activePage}`
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const activityGetService = async (_id) => {
  try {
    return await axios.get(`${window.$server_url}/admin/activities/${_id}`);
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};

export const activitySearchService = async (req) => {
  try {
    return await axios.post(
      `${window.$server_url}/admin/activities/search`,
      req
    );
  } catch (err) {
    return {
      error: true,
      errMsg: err.message,
    };
  }
};
