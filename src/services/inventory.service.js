import axios from "axios";

export const inventoryGetListService = async (activePage) => {
    try {
        return await axios.get(
            `${window.$server_url}/admin/inventories/page/${activePage}`
        );
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const inventoryGetService = async (_id) => {
    try {
        return await axios.get(`${window.$server_url}/admin/inventories/${_id}`);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const inventoryRegisterService = async (inventory) => {
    try {
        return await axios.post(
            `${window.$server_url}/admin/inventories/add`,
            inventory
        );
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const inventoryDeleteService = async (_id) => {
    try {
        return await axios.delete(
            `${window.$server_url}/admin/inventories/delete/${_id}`
        );
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const inventoryUpdateService = async (id, inventory) => {
    try {
        return await axios.patch(
            `${window.$server_url}/admin/inventories/update/${id}`,
            inventory
        );
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};
