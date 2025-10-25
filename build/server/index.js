import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, Link, Meta, Links, ScrollRestoration, Scripts, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, useLoaderData } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createContext, useState, useContext } from "react";
import { faBook, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const ThemeContext = createContext();
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children });
}
function useTheme() {
  return useContext(ThemeContext);
}
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsx("nav", { className: `navbar navbar-expand bg-${theme}`, children: /* @__PURE__ */ jsx("div", { className: "container-fluid", children: /* @__PURE__ */ jsxs("ul", { className: "navbar-nav ms-auto align-items-center d-flex mb-3", children: [
    /* @__PURE__ */ jsx("li", { className: "nav-item me-auto p-2", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "nav-link",
        children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faBook })
      }
    ) }),
    /* @__PURE__ */ jsx("li", { className: "nav-item p-2", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/users",
        className: "nav-link",
        children: "Users"
      }
    ) }),
    /* @__PURE__ */ jsx("li", { className: "nav-item p-2", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/contact",
        className: "nav-link",
        children: "Contact"
      }
    ) }),
    /* @__PURE__ */ jsx("li", { className: "nav-item p-2", children: /* @__PURE__ */ jsx(
      "button",
      {
        className: `btn btn-outline-${theme === "dark" ? "light" : "dark"} border-0 p-1 mx-2`,
        onClick: toggleTheme,
        children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLightbulb })
      }
    ) })
  ] }) }) });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "container-fluid bg-dark-subtle p-2 fixed-bottom", children: /* @__PURE__ */ jsx("p", { className: "m-0", children: "Footer" }) });
}
function HtmlShell({
  children,
  title = "React Router Template"
}) {
  const { theme } = useTheme();
  return /* @__PURE__ */ jsxs(
    "html",
    {
      lang: "en",
      "data-bs-theme": theme,
      children: [
        /* @__PURE__ */ jsxs("head", { children: [
          /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
          /* @__PURE__ */ jsx(
            "meta",
            {
              name: "viewport",
              content: "width=device-width, initial-scale=1.0"
            }
          ),
          /* @__PURE__ */ jsx("title", { children: title }),
          /* @__PURE__ */ jsx(Meta, {}),
          /* @__PURE__ */ jsx(Links, {})
        ] }),
        /* @__PURE__ */ jsxs("body", { children: [
          /* @__PURE__ */ jsx(Navbar, {}),
          children,
          /* @__PURE__ */ jsx(Footer, {}),
          /* @__PURE__ */ jsx(ScrollRestoration, {}),
          /* @__PURE__ */ jsx(Scripts, {})
        ] })
      ]
    }
  );
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(ThemeProvider, {
    children: /* @__PURE__ */ jsx(HtmlShell, {
      children: /* @__PURE__ */ jsx("main", {
        className: "container mt-4",
        children: /* @__PURE__ */ jsx(Outlet, {})
      })
    })
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  return /* @__PURE__ */ jsx(ThemeProvider, {
    children: /* @__PURE__ */ jsx(HtmlShell, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "container",
        children: [/* @__PURE__ */ jsx("h2", {
          children: "Error!"
        }), /* @__PURE__ */ jsx("h4", {
          children: error.message
        })]
      })
    })
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
}
const _index = UNSAFE_withComponentProps(function Home() {
  const data = useLoaderData().slice(0, 10);
  console.log(data);
  return /* @__PURE__ */ jsx("div", {
    children: /* @__PURE__ */ jsxs("div", {
      className: "container",
      children: [/* @__PURE__ */ jsx("h2", {
        children: "Genero"
      }), /* @__PURE__ */ jsx("div", {
        className: "bookstand",
        children: /* @__PURE__ */ jsx("div", {
          className: "overflow-auto h-25",
          children: /* @__PURE__ */ jsxs("div", {
            className: "d-flex flex-nowrap gap-4 pb-3 ",
            children: [data.map((item, index) => /* @__PURE__ */ jsxs("div", {
              className: "flex-shrink-1",
              children: [/* @__PURE__ */ jsx("img", {
                src: `https://picsum.photos/200/300?random=1`,
                className: "img-fluid img-thumbnail",
                alt: "Book"
              }), /* @__PURE__ */ jsx("h5", {
                children: item.title
              }), /* @__PURE__ */ jsx("p", {
                className: "text-wrap",
                children: item.title
              }), /* @__PURE__ */ jsx("button", {
                type: "button",
                className: "btn btn-secondary",
                children: "Más información"
              }), " #Onclick detalles libro"]
            }, index)), /* @__PURE__ */ jsx("button", {
              type: "button",
              className: "btn btn-secondary",
              children: "Más libros de #este género "
            }), " #Onclick más libros del género"]
          })
        })
      })]
    })
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const _genre = UNSAFE_withComponentProps(function Genre() {
  return /* @__PURE__ */ jsx("h1", {
    children: "GENRES"
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _genre
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  params
}) {
  const response = await fetch("http://127.0.0.1:5000/users");
  const json = response.json();
  return json;
}
const users = UNSAFE_withComponentProps(function Users() {
  const users2 = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("h1", {
      children: "Users"
    }), users2.map((e) => /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsxs("span", {
        children: [/* @__PURE__ */ jsx("b", {
          children: "Username: "
        }), e.username]
      }), /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsxs("span", {
        children: [/* @__PURE__ */ jsx("b", {
          children: "Email: "
        }), e.email]
      })]
    }))]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: users,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const contact = UNSAFE_withComponentProps(function Contact() {
  return /* @__PURE__ */ jsx("h1", {
    children: "Contact"
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: contact
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DS4Z0ZC6.js", "imports": ["/assets/chunk-OIYGIGL5-GdEQiSaq.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-U6Fhgvqk.js", "imports": ["/assets/chunk-OIYGIGL5-GdEQiSaq.js"], "css": ["/assets/root-C11chwFa.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": "/", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-fV8ZTbmu.js", "imports": ["/assets/chunk-OIYGIGL5-GdEQiSaq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_genre": { "id": "routes/_genre", "parentId": "root", "path": "/genre", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_genre-7CRlAsAg.js", "imports": ["/assets/chunk-OIYGIGL5-GdEQiSaq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/users": { "id": "routes/users", "parentId": "root", "path": "/users", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/users-ChFCyTYQ.js", "imports": ["/assets/chunk-OIYGIGL5-GdEQiSaq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/contact": { "id": "routes/contact", "parentId": "root", "path": "/contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/contact-DjZ29hqk.js", "imports": ["/assets/chunk-OIYGIGL5-GdEQiSaq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-dfb15a63.js", "version": "dfb15a63", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: "/",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_genre": {
    id: "routes/_genre",
    parentId: "root",
    path: "/genre",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/users": {
    id: "routes/users",
    parentId: "root",
    path: "/users",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/contact": {
    id: "routes/contact",
    parentId: "root",
    path: "/contact",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
