import axios from "axios";

export const inventorySearchService = async (req) => {
    try {
        return await axios.post(
            `${window.$server_url}/admin/inventories/search`,
            req
        );
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};
