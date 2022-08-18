export type urlOptions = {
  [key: string]: string | { [key: string]: string };
};

export type fetchParam = urlOptions;
export type response<T> = { [key: string]: T };
export default class Loader {
  private baseLink: string;
  readonly options: urlOptions;
  constructor(baseLink: string, options: urlOptions) {
    this.baseLink = baseLink;
    this.options = options;
  }

  async getItem<T>(
    { endpoint, options }: { endpoint: string; options?: object },
    token = "",
    fetchParam = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  ): Promise<response<T>> {
    return this.load(fetchParam, endpoint, options);
  }

  errorHandler(res: Response): never | Response {
    if (!res?.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(
          `Sorry, but there is ${res.status} error: ${res.statusText}`
        );
      throw Error(res.statusText);
    }
    return res;
  }

  makeUrl(options: urlOptions, endpoint: string): string {
    const urlOptions: urlOptions = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    Object.keys(urlOptions).forEach((key) => {
      url += `${key}=${urlOptions[key]}&`;
    });
    console.log(url.slice(0, -1));
    return url.slice(0, -1);
  }

  load<T>(
    fetchOptions: fetchParam,
    endpoint: string,
    options = {}
  ): Promise<response<T>> {
    return fetch(this.makeUrl(options, endpoint), fetchOptions)
      .then(this.errorHandler)
      .then((res: Response) => res.json())
      .catch((err: Event) => console.error(err));
  }
}
