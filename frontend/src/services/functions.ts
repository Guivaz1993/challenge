import { toast } from "react-toastify";
import api from "./api";

async function get(resource:string, token?:string) {
  try {
    const response = await api.get(resource, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status };
  } catch (error:any) {
    return error.response;
  }
}

async function post(resource:string, data:{}, token?:string) {
  try {
    const response = await api.post(resource, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error:any) {
    return error.response;
  }
}

async function patch(resource:string, data:{}, token?:string) {
  try {
    const response = await api.patch(resource, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { data: response.data, status: response.status };
  } catch (error:any) {
    return toast.error(error.message);
  }
}

async function remove(resource:string, token?:string) {
  try {
    const response = await api.delete(resource, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { data: response.data, status: response.status };
  } catch (error:any) {
    return toast.error(error.message);
  }
}

export { get, post, patch,remove };
