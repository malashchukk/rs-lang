class Router {
  routes: { path: RegExp | string; cb: () => void }[] = [];
  mode: string = null;
  root = "/";
  current: string = null;
  timer: NodeJS.Timer;

  constructor(options: { mode: string; root: string }) {
    this.mode = window.history.pushState ? "history" : "hash";
    if (options.mode) this.mode = options.mode;
    if (options.root) this.root = options.root;
    this.listen();
  }
  add = (
    path: RegExp | string,
    cb: (id?: string | number, specification?: string | number) => void
  ) => {
    this.routes.push({ path, cb });
    return this;
  };
  remove = (path: RegExp | string) => {
    for (let i = 0; i < this.routes.length; i += 1) {
      if (this.routes[i].path === path) {
        this.routes.slice(i, 1);
        return this;
      }
    }
    return this;
  };
  flush = () => {
    this.routes = [];
    return this;
  };
  clearSlashes = (path: RegExp | string) =>
    path.toString().replace(/\/$/, "").replace(/^\//, "");
  getFragment = () => {
    let fragment = "";
    if (this.mode === "history") {
      fragment = this.clearSlashes(
        decodeURI(window.location.pathname + window.location.search)
      );
      fragment = fragment.replace(/\?(.*)$/, "");
      fragment = this.root !== "/" ? fragment.replace(this.root, "") : fragment;
    } else {
      const match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : "";
    }
    return this.clearSlashes(fragment);
  };
  navigate = (path = "") => {
    if (this.mode === "history") {
      window.history.pushState(null, null, this.root + this.clearSlashes(path));
    } else {
      window.location.href = `${window.location.href.replace(
        /#(.*)$/,
        ""
      )}#${path}`;
    }
    return this;
  };
  listen = () => {
    clearInterval(this.timer);
    this.timer = setInterval(this.interval, 50);
  };
  interval = () => {
    if (this.current === this.getFragment()) return;
    this.current = this.getFragment();
    this.routes.some((route) => {
      const match = this.current.match(route.path);
      if (match) {
        match.shift();
        route.cb.apply({}, match);
        return match;
      }
      return false;
    });
  };
}

export default Router;
