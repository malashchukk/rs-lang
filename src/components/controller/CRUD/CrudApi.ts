import Loader from "./loader";
import { urlOptions } from "./loader";
class CrudApi extends Loader {
  constructor(baseLink: string, options: urlOptions) {
    super(baseLink, options);
  }
  async createItem<T>(
    { endpoint, options }: { endpoint: string; options?: object },
    body: T,
    token = "",
    fetchParam = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  ): Promise<T> {
    return this.load(
      { ...fetchParam, body: JSON.stringify(body) },
      endpoint,
      options
    );
  }

  async deleteItem<T>(
    { endpoint, options }: { endpoint: string; options?: object },
    token = "",
    fetchParam = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  ): Promise<T> {
    return this.load(fetchParam, endpoint, options);
  }

  async updateItems<T>(
    { endpoint, options }: { endpoint: string; options?: object },
    body: T,
    token = "",
    fetchParam = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  ): Promise<T> {
    return this.load(
      { ...fetchParam, body: JSON.stringify(body) },
      endpoint,
      options
    );
  }
}
const crudApi = new CrudApi("https://rslang-malashchukk.herokuapp.com", {});
export default crudApi;
