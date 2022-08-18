class Router {
  routes: Array<{ path: string; cb: () => void }> = [];
  baseUrl = "";
  root = "/";
  current = "";
  timer!: NodeJS.Timer;

  constructor(options: { root: string }) {
    if (options.root) this.root = options.root;
    this.listen();
  }
  add = (path: string, cb: () => void) => {
    this.routes.push({ path, cb });
    return this.routes;
  };
  remove = (path: string) => {
    for (let i = 0; i < this.routes.length; i += 1) {
      if (`${this.routes[i]?.path}` === `${path}`) {
        this.routes.splice(i, 1);
        return this.routes;
      }
    }
    return this.routes;
  };
  flush = () => {
    this.routes = [];
    return this.routes;
  };
  clearSlashes = (path: string) =>
    path.toString().replace(/\/$/, "").replace(/^\//, "");

  getFragment = () => {
    let fragment = "";
    const match = window.location.href.match(/#(.*)$/);
    fragment = match?.[1] ? match[1] : "";
    return this.clearSlashes(fragment);
  };
  navigate = (path = "") => {
    window.location.href = `${window.location.href.replace(
      /#(.*)$/,
      ""
    )}#${path}`;
    return this.root;
  };
  listen = () => {
    clearInterval(this.timer);
    this.timer = setInterval(this.interval, 50);
  };
  interval = () => {
    if (this.current === this.getFragment()) return;
    this.current = this.getFragment();
    this.routes.some((route) => {
      const match =
        this.clearSlashes(route.path).split("\\").join("") === this.current;
      if (match) {
        const array = this.current.match(route.path) as RegExpMatchArray;
        array.shift();
        route.cb.apply(array);
        return match;
      }
      return false;
    });
  };
}
const router = new Router({
  root: "/",
});
export default router;
