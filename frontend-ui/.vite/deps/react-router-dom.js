import { r as __toESM, t as require_react } from "./react-TUYU05Ph.js";
import { t as require_react_dom } from "./react-dom-DMGCgcj7.js";
import { $ as ScrollRestoration, $t as useLoaderData, A as HashRouter, At as isRouteErrorResponse, B as NavLink, Bt as shouldHydrateRouteLoader, C as CRITICAL_CSS_DATA_ATTRIBUTE, Ct as data, D as FetchersContext, Dt as getTurboStreamSingleFetchDataStrategy, E as ErrorResponseImpl, Et as getPatchRoutesOnNavigationFunction, F as Link, Ft as redirect, G as RemixErrorBoundary, Gt as useBlocker, H as NavigationContext, Ht as useAsyncError, I as Links, It as redirectDocument, J as Router, Jt as useFogOFWarDiscovery, K as Route, Kt as useFetcher, L as LocationContext, Lt as renderMatches, M as IDLE_BLOCKER, Mt as matchPath, N as IDLE_FETCHER, Nt as matchRoutes, O as Form, Ot as hydrationRouteProperties, P as IDLE_NAVIGATION, Pt as parsePath, Q as Scripts, Qt as useLinkClickHandler, R as MemoryRouter, Rt as replace, S as BrowserRouter, Sn as withHydrateFallbackProps, St as createStaticRouter, T as DataRouterStateContext, Tt as generatePath, U as Outlet, Ut as useAsyncValue, V as Navigate, Vt as useActionData, W as PrefetchPageLinks, Wt as useBeforeUnload, X as RouterProvider, Xt as useHref, Y as RouterContextProvider, Yt as useFormAction, Z as Routes, Zt as useInRouterContext, _ as routeRSCServerRequest, _n as useSearchParams, _t as createRouter, a as createCookie, an as useNavigationType, at as WithErrorBoundaryProps, b as Await, bn as withComponentProps, bt as createSearchParams, c as createRequestHandler, cn as useParams, ct as createBrowserRouter, d as createSessionStorage, dn as useRevalidator, dt as createContext, en as useLocation, et as SingleFetchRedirectSymbol, f as deserializeErrors, fn as useRoute, ft as createHashHistory, g as isSession, gn as useScrollRestoration, gt as createPath, h as isCookie, hn as useRoutes, ht as createMemoryRouter, i as ServerRouter, in as useNavigation, it as WithComponentProps, j as HistoryRouter, jt as mapRouteProperties, k as FrameworkContext, kt as invariant, l as createRoutesStub, ln as usePrompt, lt as createClientRoutes, m as href, mn as useRouteLoaderData, mt as createMemoryHistory, n as RSCStaticRouter, nn as useMatches, nt as StaticRouterProvider, o as createCookieSessionStorage, on as useOutlet, ot as WithHydrateFallbackProps, p as getHydrationData, pn as useRouteError, pt as createHashRouter, q as RouteContext, qt as useFetchers, r as ServerMode, rn as useNavigate, rt as ViewTransitionContext, s as createMemorySessionStorage, sn as useOutletContext, st as createBrowserHistory, t as RSCDefaultRootErrorBoundary, tn as useMatch, tt as StaticRouter, u as createSession, un as useResolvedPath, ut as createClientRoutesWithHMRRevalidationOptOut, v as setDevServerHooks, vn as useSubmit, vt as createRoutesFromChildren, w as DataRouterContext, wt as decodeViaTurboStream, x as AwaitContextProvider, xn as withErrorBoundaryProps, xt as createStaticHandler2, y as Action, yn as useViewTransitionState, yt as createRoutesFromElements, z as Meta, zt as resolvePath } from "./development-CWjWALzF.js";
//#region node_modules/react-router/dist/development/dom-export.mjs
/**
* react-router v7.13.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
function RouterProvider2(props) {
	return /* @__PURE__ */ import_react.createElement(RouterProvider, {
		flushSync: import_react_dom.flushSync,
		...props
	});
}
var ssrInfo = null;
var router = null;
function initSsrInfo() {
	if (!ssrInfo && window.__reactRouterContext && window.__reactRouterManifest && window.__reactRouterRouteModules) {
		if (window.__reactRouterManifest.sri === true) {
			const importMap = document.querySelector("script[rr-importmap]");
			if (importMap?.textContent) try {
				window.__reactRouterManifest.sri = JSON.parse(importMap.textContent).integrity;
			} catch (err) {
				console.error("Failed to parse import map", err);
			}
		}
		ssrInfo = {
			context: window.__reactRouterContext,
			manifest: window.__reactRouterManifest,
			routeModules: window.__reactRouterRouteModules,
			stateDecodingPromise: void 0,
			router: void 0,
			routerInitialized: false
		};
	}
}
function createHydratedRouter({ getContext, unstable_instrumentations }) {
	initSsrInfo();
	if (!ssrInfo) throw new Error("You must be using the SSR features of React Router in order to skip passing a `router` prop to `<RouterProvider>`");
	let localSsrInfo = ssrInfo;
	if (!ssrInfo.stateDecodingPromise) {
		let stream = ssrInfo.context.stream;
		invariant(stream, "No stream found for single fetch decoding");
		ssrInfo.context.stream = void 0;
		ssrInfo.stateDecodingPromise = decodeViaTurboStream(stream, window).then((value) => {
			ssrInfo.context.state = value.value;
			localSsrInfo.stateDecodingPromise.value = true;
		}).catch((e) => {
			localSsrInfo.stateDecodingPromise.error = e;
		});
	}
	if (ssrInfo.stateDecodingPromise.error) throw ssrInfo.stateDecodingPromise.error;
	if (!ssrInfo.stateDecodingPromise.value) throw ssrInfo.stateDecodingPromise;
	let routes = createClientRoutes(ssrInfo.manifest.routes, ssrInfo.routeModules, ssrInfo.context.state, ssrInfo.context.ssr, ssrInfo.context.isSpaMode);
	let hydrationData = void 0;
	if (ssrInfo.context.isSpaMode) {
		let { loaderData } = ssrInfo.context.state;
		if (ssrInfo.manifest.routes.root?.hasLoader && loaderData && "root" in loaderData) hydrationData = { loaderData: { root: loaderData.root } };
	} else {
		hydrationData = getHydrationData({
			state: ssrInfo.context.state,
			routes,
			getRouteInfo: (routeId) => ({
				clientLoader: ssrInfo.routeModules[routeId]?.clientLoader,
				hasLoader: ssrInfo.manifest.routes[routeId]?.hasLoader === true,
				hasHydrateFallback: ssrInfo.routeModules[routeId]?.HydrateFallback != null
			}),
			location: window.location,
			basename: window.__reactRouterContext?.basename,
			isSpaMode: ssrInfo.context.isSpaMode
		});
		if (hydrationData && hydrationData.errors) hydrationData.errors = deserializeErrors(hydrationData.errors);
	}
	if (window.history.state && window.history.state.masked) window.history.replaceState({
		...window.history.state,
		masked: void 0
	}, "");
	let router2 = createRouter({
		routes,
		history: createBrowserHistory(),
		basename: ssrInfo.context.basename,
		getContext,
		hydrationData,
		hydrationRouteProperties,
		unstable_instrumentations,
		mapRouteProperties,
		future: { middleware: ssrInfo.context.future.v8_middleware },
		dataStrategy: getTurboStreamSingleFetchDataStrategy(() => router2, ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.basename, ssrInfo.context.future.unstable_trailingSlashAwareDataRequests),
		patchRoutesOnNavigation: getPatchRoutesOnNavigationFunction(() => router2, ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.routeDiscovery, ssrInfo.context.isSpaMode, ssrInfo.context.basename)
	});
	ssrInfo.router = router2;
	if (router2.state.initialized) {
		ssrInfo.routerInitialized = true;
		router2.initialize();
	}
	router2.createRoutesForHMR = createClientRoutesWithHMRRevalidationOptOut;
	window.__reactRouterDataRouter = router2;
	return router2;
}
function HydratedRouter(props) {
	if (!router) router = createHydratedRouter({
		getContext: props.getContext,
		unstable_instrumentations: props.unstable_instrumentations
	});
	let [criticalCss, setCriticalCss] = import_react.useState(ssrInfo?.context.criticalCss);
	import_react.useEffect(() => {
		setCriticalCss(void 0);
	}, []);
	import_react.useEffect(() => {
		if (criticalCss === void 0) document.querySelectorAll(`[${CRITICAL_CSS_DATA_ATTRIBUTE}]`).forEach((element) => element.remove());
	}, [criticalCss]);
	let [location2, setLocation] = import_react.useState(router.state.location);
	import_react.useLayoutEffect(() => {
		if (ssrInfo && ssrInfo.router && !ssrInfo.routerInitialized) {
			ssrInfo.routerInitialized = true;
			ssrInfo.router.initialize();
		}
	}, []);
	import_react.useLayoutEffect(() => {
		if (ssrInfo && ssrInfo.router) return ssrInfo.router.subscribe((newState) => {
			if (newState.location !== location2) setLocation(newState.location);
		});
	}, [location2]);
	invariant(ssrInfo, "ssrInfo unavailable for HydratedRouter");
	useFogOFWarDiscovery(router, ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.routeDiscovery, ssrInfo.context.isSpaMode);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, /* @__PURE__ */ import_react.createElement(FrameworkContext.Provider, { value: {
		manifest: ssrInfo.manifest,
		routeModules: ssrInfo.routeModules,
		future: ssrInfo.context.future,
		criticalCss,
		ssr: ssrInfo.context.ssr,
		isSpaMode: ssrInfo.context.isSpaMode,
		routeDiscovery: ssrInfo.context.routeDiscovery
	} }, /* @__PURE__ */ import_react.createElement(RemixErrorBoundary, { location: location2 }, /* @__PURE__ */ import_react.createElement(RouterProvider2, {
		router,
		unstable_useTransitions: props.unstable_useTransitions,
		onError: props.onError
	}))), /* @__PURE__ */ import_react.createElement(import_react.Fragment, null));
}
createContext();
//#endregion
//#region node_modules/react-router-dom/dist/index.mjs
/**
* react-router-dom v7.13.1
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
//#endregion
export { Await, BrowserRouter, Form, HashRouter, HydratedRouter, IDLE_BLOCKER, IDLE_FETCHER, IDLE_NAVIGATION, Link, Links, MemoryRouter, Meta, NavLink, Navigate, Action as NavigationType, Outlet, PrefetchPageLinks, Route, Router, RouterContextProvider, RouterProvider2 as RouterProvider, Routes, Scripts, ScrollRestoration, ServerRouter, StaticRouter, StaticRouterProvider, AwaitContextProvider as UNSAFE_AwaitContextProvider, DataRouterContext as UNSAFE_DataRouterContext, DataRouterStateContext as UNSAFE_DataRouterStateContext, ErrorResponseImpl as UNSAFE_ErrorResponseImpl, FetchersContext as UNSAFE_FetchersContext, FrameworkContext as UNSAFE_FrameworkContext, LocationContext as UNSAFE_LocationContext, NavigationContext as UNSAFE_NavigationContext, RSCDefaultRootErrorBoundary as UNSAFE_RSCDefaultRootErrorBoundary, RemixErrorBoundary as UNSAFE_RemixErrorBoundary, RouteContext as UNSAFE_RouteContext, ServerMode as UNSAFE_ServerMode, SingleFetchRedirectSymbol as UNSAFE_SingleFetchRedirectSymbol, ViewTransitionContext as UNSAFE_ViewTransitionContext, WithComponentProps as UNSAFE_WithComponentProps, WithErrorBoundaryProps as UNSAFE_WithErrorBoundaryProps, WithHydrateFallbackProps as UNSAFE_WithHydrateFallbackProps, createBrowserHistory as UNSAFE_createBrowserHistory, createClientRoutes as UNSAFE_createClientRoutes, createClientRoutesWithHMRRevalidationOptOut as UNSAFE_createClientRoutesWithHMRRevalidationOptOut, createHashHistory as UNSAFE_createHashHistory, createMemoryHistory as UNSAFE_createMemoryHistory, createRouter as UNSAFE_createRouter, decodeViaTurboStream as UNSAFE_decodeViaTurboStream, deserializeErrors as UNSAFE_deserializeErrors, getHydrationData as UNSAFE_getHydrationData, getPatchRoutesOnNavigationFunction as UNSAFE_getPatchRoutesOnNavigationFunction, getTurboStreamSingleFetchDataStrategy as UNSAFE_getTurboStreamSingleFetchDataStrategy, hydrationRouteProperties as UNSAFE_hydrationRouteProperties, invariant as UNSAFE_invariant, mapRouteProperties as UNSAFE_mapRouteProperties, shouldHydrateRouteLoader as UNSAFE_shouldHydrateRouteLoader, useFogOFWarDiscovery as UNSAFE_useFogOFWarDiscovery, useScrollRestoration as UNSAFE_useScrollRestoration, withComponentProps as UNSAFE_withComponentProps, withErrorBoundaryProps as UNSAFE_withErrorBoundaryProps, withHydrateFallbackProps as UNSAFE_withHydrateFallbackProps, createBrowserRouter, createContext, createCookie, createCookieSessionStorage, createHashRouter, createMemoryRouter, createMemorySessionStorage, createPath, createRequestHandler, createRoutesFromChildren, createRoutesFromElements, createRoutesStub, createSearchParams, createSession, createSessionStorage, createStaticHandler2 as createStaticHandler, createStaticRouter, data, generatePath, href, isCookie, isRouteErrorResponse, isSession, matchPath, matchRoutes, parsePath, redirect, redirectDocument, renderMatches, replace, resolvePath, HistoryRouter as unstable_HistoryRouter, RSCStaticRouter as unstable_RSCStaticRouter, routeRSCServerRequest as unstable_routeRSCServerRequest, setDevServerHooks as unstable_setDevServerHooks, usePrompt as unstable_usePrompt, useRoute as unstable_useRoute, useActionData, useAsyncError, useAsyncValue, useBeforeUnload, useBlocker, useFetcher, useFetchers, useFormAction, useHref, useInRouterContext, useLinkClickHandler, useLoaderData, useLocation, useMatch, useMatches, useNavigate, useNavigation, useNavigationType, useOutlet, useOutletContext, useParams, useResolvedPath, useRevalidator, useRouteError, useRouteLoaderData, useRoutes, useSearchParams, useSubmit, useViewTransitionState };

//# sourceMappingURL=react-router-dom.js.map