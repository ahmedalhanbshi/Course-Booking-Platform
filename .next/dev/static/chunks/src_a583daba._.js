(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
            destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
            outline: "text-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border bg-card text-card-foreground shadow", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 48,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 68,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/85 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = DialogOverlay;
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ className, overlayClassName, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {
                className: overlayClassName
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 39,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        "data-dialog-close": "default",
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 53,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 54,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 49,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 40,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = DialogContent;
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 65,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = DialogHeader;
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 79,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = DialogFooter;
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 93,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c6 = DialogTitle;
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 108,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = DialogDescription;
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DialogOverlay");
__turbopack_context__.k.register(_c1, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "DialogContent");
__turbopack_context__.k.register(_c3, "DialogHeader");
__turbopack_context__.k.register(_c4, "DialogFooter");
__turbopack_context__.k.register(_c5, "DialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "DialogTitle");
__turbopack_context__.k.register(_c7, "DialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type, dir, ...props }, ref)=>{
    const normalizedType = type?.toLowerCase();
    const shouldRtl = !normalizedType || normalizedType !== "number" && normalizedType !== "url";
    const resolvedDir = dir ?? (shouldRtl ? "rtl" : undefined);
    const isRtl = resolvedDir === "rtl";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", isRtl && "text-right", className),
        dir: resolvedDir,
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 13,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/label.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/courses/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CourseDetailsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-upload.js [app-client] (ecmascript) <export default as UploadCloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const FAVORITES_KEY = "courseFavorites";
const REGISTRATION_KEY_PREFIX = "exploreRegistration";
const ENROLLMENTS_KEY = "myCoursesEnrollments";
const RECEIPT_KEY_PREFIX = "exploreReceipt";
const steps = [
    {
        id: 1,
        label: "تسجيل مبدئي"
    },
    {
        id: 2,
        label: "انتظار موافقة المدرب"
    },
    {
        id: 3,
        label: "تأكيد الدفع"
    },
    {
        id: 4,
        label: "تم التسجيل"
    }
];
const coursesDatabase = {
    "6": {
        id: "6",
        title: "تحليل البيانات باستخدام SQL",
        category: "قواعد البيانات",
        shortDescription: "دورة عملية تركز على مهارات SQL الأساسية والمتقدمة لتحليل البيانات وبناء التقارير.",
        description: "ستتعلم في هذه الدورة كيفية كتابة استعلامات SQL بكفاءة، وتنظيم البيانات، وبناء تقارير قابلة للمشاركة. الدورة مصممة بأسلوب عملي مع أمثلة واقعية وتمارين قصيرة.",
        image: "/images/course-web.png",
        price: 19900,
        startDate: "2025-02-10",
        endDate: "2025-03-20",
        startTime: "18:00",
        endTime: "20:00",
        maxStudents: 25,
        deliveryType: "online",
        onlinePlatform: "Google Meet",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        surveyLink: "https://forms.gle/example-survey",
        surveyRequired: true,
        prerequisites: [
            "معرفة أساسية بالحاسب والإنترنت",
            "يفضل الإلمام بالمفاهيم العامة للبيانات"
        ],
        objectives: [
            "كتابة استعلامات SQL دقيقة وسريعة",
            "تنظيم البيانات باستخدام التصفية والتجميع",
            "إنشاء تقارير بسيطة من البيانات",
            "قراءة المخططات وفهم العلاقات بين الجداول"
        ],
        tags: [
            "SQL",
            "تحليل البيانات",
            "قواعد البيانات"
        ],
        schedule: [
            {
                date: "2025-02-10",
                startTime: "18:00",
                endTime: "20:00"
            },
            {
                date: "2025-02-13",
                startTime: "18:00",
                endTime: "20:00"
            },
            {
                date: "2025-02-17",
                startTime: "18:00",
                endTime: "20:00"
            }
        ],
        instructor: {
            name: "أحمد محمد",
            title: "مدرب برمجة – SQL وتحليل البيانات",
            bio: "خبرة في بناء حلول بيانات عملية وتدريب فرق تقنية على كتابة الاستعلامات وتحليل البيانات.",
            avatar: "/images/avatar-1.png",
            bankName: "بنك اليمن الدولي",
            iban: "YE12 0001 2345 6789 0000 12",
            bankAccounts: [
                {
                    id: "ycb",
                    bankName: "بنك اليمن الدولي",
                    iban: "YE12 0001 2345 6789 0000 12",
                    beneficiary: "أحمد محمد",
                    accountNumber: "00123456"
                },
                {
                    id: "cby",
                    bankName: "البنك المركزي اليمني",
                    iban: "YE34 0002 9876 5432 1000 98",
                    beneficiary: "أحمد محمد",
                    accountNumber: "76543210"
                }
            ],
            email: "instructor@example.com",
            linkedin: "https://www.linkedin.com/in/ahmed"
        }
    },
    "1": {
        id: "1",
        title: "تعلم React من الصفر",
        category: "تطوير الويب",
        shortDescription: "دورة مكثفة لبناء واجهات تفاعلية باستخدام React خطوة بخطوة.",
        description: "تركز الدورة على بناء أساس قوي في React من خلال تطبيقات صغيرة وتمارين عملية، مع توضيح المفاهيم الأساسية بطريقة مبسطة.",
        image: "/images/course-web.png",
        price: 29900,
        startDate: "2025-02-01",
        endDate: "2025-03-15",
        startTime: "19:00",
        endTime: "21:00",
        maxStudents: 30,
        deliveryType: "hybrid",
        onlinePlatform: "Zoom",
        meetingLink: "https://zoom.us/j/000000000",
        surveyLink: "https://forms.gle/example-survey-2",
        surveyRequired: false,
        hall: {
            name: "القاعة التدريبية (ج)",
            location: "الدور الأول - الجناح الشرقي"
        },
        prerequisites: [
            "أساسيات HTML و CSS",
            "معرفة عامة بـ JavaScript"
        ],
        objectives: [
            "فهم هيكل React ومكونات الواجهة",
            "بناء مكونات قابلة لإعادة الاستخدام",
            "إدارة الحالة والتعامل مع الأحداث"
        ],
        tags: [
            "React",
            "Frontend",
            "JavaScript"
        ],
        schedule: [
            {
                date: "2025-02-01",
                startTime: "19:00",
                endTime: "21:00"
            },
            {
                date: "2025-02-04",
                startTime: "19:00",
                endTime: "21:00"
            }
        ],
        instructor: {
            name: "أحمد محمد",
            title: "مدرب برمجة – React",
            bio: "خبرة عملية في تطوير الواجهات وبناء منتجات تعليمية تفاعلية لمؤسسات محلية وعالمية.",
            avatar: "/images/avatar-1.png",
            bankName: "بنك اليمن الدولي",
            iban: "YE12 0001 2345 6789 0000 12",
            bankAccounts: [
                {
                    id: "ycb-react",
                    bankName: "بنك اليمن الدولي",
                    iban: "YE12 0001 2345 6789 0000 12",
                    beneficiary: "أحمد محمد",
                    accountNumber: "00123456"
                },
                {
                    id: "alqura",
                    bankName: "بنك القُرى الإسلامي",
                    iban: "YE55 0003 1122 3344 5566 77",
                    beneficiary: "أحمد محمد",
                    accountNumber: "99887766"
                }
            ],
            email: "instructor@example.com",
            linkedin: "https://www.linkedin.com/in/ahmed"
        }
    },
    "2": {
        id: "2",
        title: "تصميم واجهات المستخدم الاحترافية",
        category: "تصميم وجرافيك",
        shortDescription: "أسس تصميم واجهات واضحة وتجربة مستخدم عملية لمنتجات الويب والتطبيقات.",
        description: "تغطي الدورة مبادئ التصميم المرئي، بناء الأنظمة المرنة، وتطبيق معايير تجربة المستخدم في مشاريع واقعية.",
        image: "/images/course-design.png",
        price: 25000,
        startDate: "2025-03-05",
        endDate: "2025-04-10",
        startTime: "18:00",
        endTime: "20:00",
        maxStudents: 24,
        deliveryType: "online",
        onlinePlatform: "Google Meet",
        meetingLink: "https://meet.google.com/ui-ux-design",
        surveyLink: "https://forms.gle/example-survey-ui",
        surveyRequired: false,
        prerequisites: [
            "معرفة أساسية بالتصميم",
            "اهتمام بتجربة المستخدم"
        ],
        objectives: [
            "تصميم واجهات متوازنة وواضحة",
            "تحسين تجربة المستخدم عبر تدفقات مبسطة",
            "بناء مكتبة مكونات قابلة لإعادة الاستخدام"
        ],
        tags: [
            "UI",
            "UX",
            "Design"
        ],
        schedule: [
            {
                date: "2025-03-05",
                startTime: "18:00",
                endTime: "20:00"
            },
            {
                date: "2025-03-09",
                startTime: "18:00",
                endTime: "20:00"
            },
            {
                date: "2025-03-12",
                startTime: "18:00",
                endTime: "20:00"
            }
        ],
        instructor: {
            name: "سارة خالد",
            title: "مصممة تجربة مستخدم",
            bio: "خبرة في تصميم منتجات رقمية وتبسيط الرحلات للمستخدمين.",
            avatar: "/images/avatar-2.png",
            bankName: "بنك القُرى الإسلامي",
            iban: "YE55 0003 1122 3344 5566 77",
            bankAccounts: [
                {
                    id: "alqura-ui",
                    bankName: "بنك القُرى الإسلامي",
                    iban: "YE55 0003 1122 3344 5566 77",
                    beneficiary: "سارة خالد",
                    accountNumber: "44556677"
                },
                {
                    id: "ycb-ui",
                    bankName: "بنك اليمن الدولي",
                    iban: "YE12 0001 2345 6789 0000 12",
                    beneficiary: "سارة خالد",
                    accountNumber: "22334455"
                }
            ],
            email: "sara@example.com",
            linkedin: "https://www.linkedin.com/in/sara"
        }
    },
    "3": {
        id: "3",
        title: "أساسيات تحليل البيانات",
        category: "إدارة أعمال",
        shortDescription: "تعلم تحليل البيانات وبناء التقارير لاتخاذ قرارات أفضل.",
        description: "دورة عملية لبناء مهارات تحليل البيانات باستخدام جداول البيانات وأدوات التصور.",
        image: "/images/course-web.png",
        price: 18000,
        startDate: "2025-03-15",
        endDate: "2025-04-20",
        startTime: "19:00",
        endTime: "21:00",
        maxStudents: 30,
        deliveryType: "hybrid",
        onlinePlatform: "Zoom",
        meetingLink: "https://zoom.us/j/111222333",
        surveyLink: "https://forms.gle/example-survey-data",
        surveyRequired: false,
        hall: {
            name: "قاعة التدريب (ب)",
            location: "الدور الثاني - الجناح الغربي"
        },
        prerequisites: [
            "معرفة أساسية بالجداول",
            "اهتمام بالأرقام"
        ],
        objectives: [
            "تحليل البيانات وبناء مؤشرات",
            "استخدام جداول محورية",
            "تصميم تقارير بسيطة"
        ],
        tags: [
            "Data",
            "Analytics",
            "Business"
        ],
        schedule: [
            {
                date: "2025-03-15",
                startTime: "19:00",
                endTime: "21:00"
            },
            {
                date: "2025-03-18",
                startTime: "19:00",
                endTime: "21:00"
            },
            {
                date: "2025-03-22",
                startTime: "19:00",
                endTime: "21:00"
            }
        ],
        instructor: {
            name: "محمد علي",
            title: "محلل بيانات",
            bio: "متخصص في التحليل وبناء لوحات البيانات للمؤسسات.",
            avatar: "/images/avatar-3.png",
            bankName: "البنك المركزي اليمني",
            iban: "YE34 0002 9876 5432 1000 98",
            bankAccounts: [
                {
                    id: "cby-data",
                    bankName: "البنك المركزي اليمني",
                    iban: "YE34 0002 9876 5432 1000 98",
                    beneficiary: "محمد علي",
                    accountNumber: "88990011"
                }
            ],
            email: "mohamed@example.com",
            linkedin: "https://www.linkedin.com/in/mohamed"
        }
    },
    "4": {
        id: "4",
        title: "إدارة المشاريع بأسلوب عملي",
        category: "إدارة أعمال",
        shortDescription: "من التخطيط إلى التنفيذ، تعلم إدارة المشاريع خطوة بخطوة.",
        description: "يغطي المسار أدوات التخطيط، إدارة المخاطر، والتواصل مع أصحاب المصلحة.",
        image: "/images/course-abstract.svg",
        price: 22000,
        startDate: "2025-04-01",
        endDate: "2025-05-05",
        startTime: "17:00",
        endTime: "19:00",
        maxStudents: 28,
        deliveryType: "online",
        onlinePlatform: "Microsoft Teams",
        meetingLink: "https://teams.microsoft.com/l/meetup-join/project",
        surveyLink: "https://forms.gle/example-survey-pm",
        surveyRequired: false,
        prerequisites: [
            "خبرة عامة بالعمل الجماعي"
        ],
        objectives: [
            "وضع خطة عمل واضحة",
            "تحديد المخاطر وإدارتها",
            "متابعة تقدم الفريق بفعالية"
        ],
        tags: [
            "PM",
            "Management",
            "Leadership"
        ],
        schedule: [
            {
                date: "2025-04-01",
                startTime: "17:00",
                endTime: "19:00"
            },
            {
                date: "2025-04-05",
                startTime: "17:00",
                endTime: "19:00"
            },
            {
                date: "2025-04-08",
                startTime: "17:00",
                endTime: "19:00"
            }
        ],
        instructor: {
            name: "ليلى حسن",
            title: "مديرة مشاريع",
            bio: "تقود فرق متعددة التخصصات وتبني خطط تنفيذ عملية.",
            avatar: "/images/avatar-2.png",
            bankName: "بنك اليمن الدولي",
            iban: "YE12 0001 2345 6789 0000 12",
            bankAccounts: [
                {
                    id: "ycb-pm",
                    bankName: "بنك اليمن الدولي",
                    iban: "YE12 0001 2345 6789 0000 12",
                    beneficiary: "ليلى حسن",
                    accountNumber: "55443322"
                }
            ],
            email: "layla@example.com",
            linkedin: "https://www.linkedin.com/in/layla"
        }
    }
};
const deliveryLabels = {
    online: "أونلاين",
    in_person: "حضوري",
    hybrid: "مدمج",
    capacity_based: "تحديد القاعة عند اكتمال العدد"
};
function CourseDetailsPage() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const courseId = typeof params.id === "string" ? params.id : "6";
    const course = coursesDatabase[courseId] ?? coursesDatabase["6"];
    const [isDialogOpen, setIsDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isFavorite, setIsFavorite] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [registrationStatus, setRegistrationStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("NONE");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoadingRegistration, setIsLoadingRegistration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [receiptFile, setReceiptFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [receiptInfo, setReceiptInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        note: ""
    });
    const [isDraggingFile, setIsDraggingFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [paymentError, setPaymentError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [expandedBankId, setExpandedBankId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const paymentFileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [formErrors, setFormErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        email: "",
        phone: ""
    });
    const [registrationId, setRegistrationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isEditMode, setIsEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const shouldShowSurvey = Boolean(course.surveyLink);
    const bankAccounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CourseDetailsPage.useMemo[bankAccounts]": ()=>{
            if (course.instructor.bankAccounts?.length) {
                return course.instructor.bankAccounts;
            }
            return [
                {
                    id: "primary",
                    bankName: course.instructor.bankName,
                    iban: course.instructor.iban,
                    beneficiary: course.instructor.name
                }
            ];
        }
    }["CourseDetailsPage.useMemo[bankAccounts]"], [
        course.instructor
    ]);
    const formatFileSize = (size)=>{
        if (!size || Number.isNaN(size)) return "";
        if (size < 1024) return `${size} B`;
        const kb = size / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
    };
    const registrationStorageKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CourseDetailsPage.useMemo[registrationStorageKey]": ()=>`${REGISTRATION_KEY_PREFIX}:${user?.id ?? "guest"}:${courseId}`
    }["CourseDetailsPage.useMemo[registrationStorageKey]"], [
        courseId,
        user?.id
    ]);
    const registrationFormKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CourseDetailsPage.useMemo[registrationFormKey]": ()=>`${REGISTRATION_KEY_PREFIX}:form:${user?.id ?? "guest"}:${courseId}`
    }["CourseDetailsPage.useMemo[registrationFormKey]"], [
        courseId,
        user?.id
    ]);
    const receiptStorageKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CourseDetailsPage.useMemo[receiptStorageKey]": ()=>`${RECEIPT_KEY_PREFIX}:${user?.id ?? "guest"}:${courseId}`
    }["CourseDetailsPage.useMemo[receiptStorageKey]"], [
        courseId,
        user?.id
    ]);
    const formatYER = (value)=>`${new Intl.NumberFormat("en-US").format(value)} ر.ي`;
    const readFavorites = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const stored = window.localStorage.getItem(FAVORITES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch  {
            return [];
        }
    };
    const writeFavorites = (items)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
        window.dispatchEvent(new Event("favorites-updated"));
    };
    const readRegistrationForm = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const stored = window.localStorage.getItem(registrationFormKey);
            if (!stored) return null;
            return JSON.parse(stored);
        } catch  {
            return null;
        }
    };
    const persistRegistrationForm = (data)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.localStorage.setItem(registrationFormKey, JSON.stringify(data));
    };
    const openRegistrationDialog = async (mode)=>{
        setIsEditMode(mode === "edit");
        setFormErrors({});
        setIsDialogOpen(true);
        if (mode === "create") {
            setRegistrationId(null);
        }
        if (mode === "edit") {
            setIsLoadingRegistration(true);
            const stored = readRegistrationForm();
            if (stored) {
                setFormData(stored);
                setIsLoadingRegistration(false);
                return;
            }
            if (!user?.id) {
                setIsLoadingRegistration(false);
                return;
            }
            try {
                const response = await fetch(`/api/enrollments/${courseId}/me`, {
                    method: "GET",
                    cache: "no-store"
                });
                if (!response.ok) {
                    setIsLoadingRegistration(false);
                    return;
                }
                const payload = await response.json();
                setRegistrationId(payload?.id ?? null);
                setFormData({
                    name: payload?.fullName ?? "",
                    email: payload?.email ?? "",
                    phone: payload?.phone ?? ""
                });
            } catch  {
            // ignore fetch errors, allow manual edit
            } finally{
                setIsLoadingRegistration(false);
            }
        }
    };
    const toggleFavorite = ()=>{
        const favorites = readFavorites();
        const nextFavorites = favorites.includes(course.id) ? favorites.filter((id)=>id !== course.id) : [
            ...favorites,
            course.id
        ];
        writeFavorites(nextFavorites);
        setIsFavorite(nextFavorites.includes(course.id));
    };
    const handleReceiptFile = (file)=>{
        setReceiptFile(file);
        if (file) {
            setReceiptInfo((prev)=>({
                    ...prev,
                    name: file.name
                }));
        }
        setPaymentError("");
    };
    const readReceiptInfo = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const stored = window.localStorage.getItem(receiptStorageKey);
            if (!stored) return null;
            return JSON.parse(stored);
        } catch  {
            return null;
        }
    };
    const persistReceiptInfo = (info)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.localStorage.setItem(receiptStorageKey, JSON.stringify(info));
    };
    const handleCopyValue = async (value, label)=>{
        try {
            await navigator.clipboard.writeText(value);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`تم نسخ ${label}`);
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`تعذر نسخ ${label}`);
        }
    };
    const persistRegistrationStatus = (status)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.localStorage.setItem(registrationStorageKey, status);
    };
    const saveEnrollment = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const stored = window.localStorage.getItem(ENROLLMENTS_KEY);
            const list = stored ? JSON.parse(stored) : [];
            const exists = list.some((item)=>item?.courseId === course.id);
            if (exists) return;
            list.unshift({
                courseId: course.id,
                title: course.title,
                description: course.description,
                shortDescription: course.shortDescription,
                category: course.category,
                price: course.price,
                image: course.image,
                startDate: course.startDate,
                endDate: course.endDate,
                maxStudents: course.maxStudents,
                instructorName: course.instructor.name,
                instructorAvatar: course.instructor.avatar,
                createdAt: new Date().toISOString()
            });
            window.localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(list));
            window.dispatchEvent(new Event("enrollments-updated"));
        } catch  {
        // ignore storage errors
        }
    };
    const getStepState = (stepId)=>{
        if (registrationStatus === "NONE") {
            return stepId === 1 ? "active" : "upcoming";
        }
        if (registrationStatus === "PENDING_APPROVAL") {
            if (stepId === 1) return "completed";
            if (stepId === 2) return "active";
            return "upcoming";
        }
        if (registrationStatus === "APPROVED") {
            if (stepId <= 2) return "completed";
            if (stepId === 3) return "active";
            return "upcoming";
        }
        if (registrationStatus === "PAYMENT_PENDING") {
            if (stepId <= 2) return "completed";
            if (stepId === 3) return "active";
            return "upcoming";
        }
        if (registrationStatus === "PAYMENT_CONFIRMED") {
            if (stepId <= 3) return "completed";
            if (stepId === 4) return "active";
            return "upcoming";
        }
        if (registrationStatus === "PAYMENT_REJECTED") {
            if (stepId <= 2) return "completed";
            if (stepId === 3) return "rejected";
            return "upcoming";
        }
        if (registrationStatus === "ENROLLED") {
            return "completed";
        }
        if (registrationStatus === "REJECTED") {
            if (stepId === 1) return "completed";
            if (stepId === 2) return "rejected";
            return "upcoming";
        }
        return "upcoming";
    };
    const getConnectorClass = (stepId)=>{
        const state = getStepState(stepId);
        if (state === "completed") return "bg-emerald-500";
        if (state === "rejected") return "bg-red-500";
        return "bg-white/20";
    };
    const updateRegistrationStatus = async (status, endpoint, payload)=>{
        if (!user?.id) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("يرجى تسجيل الدخول أولًا");
            return false;
        }
        setIsUpdatingStatus(true);
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: user.id,
                    courseId,
                    status,
                    ...payload
                })
            });
            if (response.ok) {
                const payload = await response.json();
                const nextStatus = payload?.status || status;
                setRegistrationStatus(nextStatus);
                persistRegistrationStatus(nextStatus);
                return true;
            }
            if (response.status === 401) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("يرجى تسجيل الدخول أولًا");
                return false;
            }
            // Fallback to local state for demo flow if API fails.
            setRegistrationStatus(status);
            persistRegistrationStatus(status);
            return true;
        } catch  {
            // Network error fallback for demo flow.
            setRegistrationStatus(status);
            persistRegistrationStatus(status);
            return true;
        } finally{
            setIsUpdatingStatus(false);
        }
    };
    const handlePaymentConfirmation = async ()=>{
        if (!receiptFile && !receiptInfo.name) {
            setPaymentError("يرجى رفع سند الدفع قبل التأكيد.");
            return;
        }
        setPaymentError("");
        const success = await updateRegistrationStatus("PAYMENT_PENDING", "/api/payment-proof");
        if (success) {
            const nextInfo = {
                name: receiptFile?.name ?? receiptInfo.name,
                note: receiptInfo.note
            };
            setReceiptInfo(nextInfo);
            persistReceiptInfo(nextInfo);
            setIsPaymentDialogOpen(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("تم رفع سند الدفع وسيتم مراجعته من المدرب.");
        }
    };
    const handlePaymentApprovalSimulation = async ()=>{
        const success = await updateRegistrationStatus("ENROLLED", "/api/payment-approve");
        if (success) {
            saveEnrollment();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("تم تأكيد الدفع بنجاح، تم تسجيلك بالدورة 🎉");
        }
    };
    const handlePaymentRejectionSimulation = ()=>{
        setRegistrationStatus("PAYMENT_REJECTED");
        persistRegistrationStatus("PAYMENT_REJECTED");
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("تم رفض الدفع، يرجى تعديل السند.");
    };
    const handleTrainerApprovalSimulation = async ()=>{
        const success = await updateRegistrationStatus("APPROVED", "/api/trainer-approve");
        if (success) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("تمت الموافقة المبدئية على التسجيل");
        }
    };
    const handleRegister = async ()=>{
        if (isEditMode) {
            const errors = {};
            if (!formData.name.trim()) {
                errors.name = "الاسم الكامل مطلوب";
            }
            if (!formData.email.trim()) {
                errors.email = "البريد الإلكتروني مطلوب";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.email = "البريد الإلكتروني غير صالح";
            }
            if (!formData.phone.trim()) {
                errors.phone = "رقم الهاتف مطلوب";
            }
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }
            if (!user?.id) {
                setFormErrors({
                    submit: "يرجى تسجيل الدخول أولًا."
                });
                return;
            }
            setIsSubmitting(true);
            setFormErrors({});
            try {
                const response = await fetch(`/api/enrollments/${courseId}/me`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        enrollmentId: registrationId,
                        userId: user.id,
                        courseId,
                        fullName: formData.name,
                        email: formData.email,
                        phone: formData.phone
                    })
                });
                if (!response.ok) {
                    const payload = await response.json().catch(()=>({}));
                    setFormErrors({
                        submit: payload?.message || "تعذر تحديث البيانات الآن"
                    });
                    return;
                }
            } catch  {
            // ignore network error for demo flow
            } finally{
                setIsSubmitting(false);
            }
            persistRegistrationForm(formData);
            setIsDialogOpen(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("تم تحديث بيانات التسجيل المبدئي");
            return;
        }
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = "الاسم الكامل مطلوب";
        }
        if (!formData.email.trim()) {
            errors.email = "البريد الإلكتروني مطلوب";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "البريد الإلكتروني غير صالح";
        }
        if (!formData.phone.trim()) {
            errors.phone = "رقم الهاتف مطلوب";
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        if (!user?.id) {
            setFormErrors({
                submit: "يرجى تسجيل الدخول لإرسال الطلب."
            });
            return;
        }
        setIsSubmitting(true);
        setFormErrors({});
        try {
            const response = await fetch("/api/pre-register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    courseId,
                    fullName: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    userId: user?.id
                })
            });
            if (!response.ok) {
                const payload = await response.json().catch(()=>({}));
                setFormErrors({
                    submit: payload?.message || "تعذر إرسال الطلب الآن"
                });
                return;
            }
            const payload = await response.json();
            const nextStatus = payload?.status || "PENDING_APPROVAL";
            persistRegistrationForm(formData);
            setRegistrationStatus(nextStatus);
            persistRegistrationStatus(nextStatus);
            setIsDialogOpen(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("تم إرسال طلب التسجيل المبدئي", {
                description: "سيتم التواصل معك لتأكيد الحجز"
            });
        } catch (error) {
            setFormErrors({
                submit: "حدث خطأ غير متوقع. حاول مرة أخرى."
            });
        } finally{
            setIsSubmitting(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CourseDetailsPage.useEffect": ()=>{
            const controller = new AbortController();
            const loadStatus = {
                "CourseDetailsPage.useEffect.loadStatus": async ()=>{
                    if ("TURBOPACK compile-time truthy", 1) {
                        const savedStatus = window.localStorage.getItem(registrationStorageKey);
                        if (savedStatus) {
                            setRegistrationStatus(savedStatus);
                            return;
                        }
                    }
                    try {
                        const params = new URLSearchParams();
                        if (user?.id) {
                            params.set("userId", user.id);
                        }
                        params.set("courseId", courseId);
                        const response = await fetch(`/api/enrollment-status?${params.toString()}`, {
                            signal: controller.signal,
                            cache: "no-store"
                        });
                        if (!response.ok) return;
                        const payload = await response.json();
                        if (payload?.status) {
                            setRegistrationStatus(payload.status);
                            persistRegistrationStatus(payload.status);
                        }
                    } catch  {
                    // ignore
                    }
                }
            }["CourseDetailsPage.useEffect.loadStatus"];
            loadStatus();
            return ({
                "CourseDetailsPage.useEffect": ()=>controller.abort()
            })["CourseDetailsPage.useEffect"];
        }
    }["CourseDetailsPage.useEffect"], [
        courseId,
        registrationStorageKey,
        user?.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CourseDetailsPage.useEffect": ()=>{
            if (!isDialogOpen) {
                setIsEditMode(false);
                setIsLoadingRegistration(false);
            }
        }
    }["CourseDetailsPage.useEffect"], [
        isDialogOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CourseDetailsPage.useEffect": ()=>{
            if (registrationStatus !== "APPROVED" && registrationStatus !== "PAYMENT_PENDING" && registrationStatus !== "PAYMENT_REJECTED") {
                setReceiptFile(null);
                setPaymentError("");
            }
        }
    }["CourseDetailsPage.useEffect"], [
        registrationStatus
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CourseDetailsPage.useEffect": ()=>{
            if (!isPaymentDialogOpen) return;
            const stored = readReceiptInfo();
            if (stored) {
                setReceiptInfo({
                    name: stored?.name ?? "",
                    note: stored?.note ?? ""
                });
            } else {
                setReceiptInfo({
                    name: "",
                    note: ""
                });
            }
            if (!expandedBankId && bankAccounts.length) {
                setExpandedBankId(bankAccounts[0].id);
            }
        }
    }["CourseDetailsPage.useEffect"], [
        bankAccounts,
        expandedBankId,
        isPaymentDialogOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CourseDetailsPage.useEffect": ()=>{
            const syncFavorite = {
                "CourseDetailsPage.useEffect.syncFavorite": ()=>{
                    const favorites = readFavorites();
                    setIsFavorite(favorites.includes(course.id));
                }
            }["CourseDetailsPage.useEffect.syncFavorite"];
            syncFavorite();
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const handleUpdate = {
                "CourseDetailsPage.useEffect.handleUpdate": ()=>syncFavorite()
            }["CourseDetailsPage.useEffect.handleUpdate"];
            window.addEventListener("favorites-updated", handleUpdate);
            window.addEventListener("storage", handleUpdate);
            return ({
                "CourseDetailsPage.useEffect": ()=>{
                    window.removeEventListener("favorites-updated", handleUpdate);
                    window.removeEventListener("storage", handleUpdate);
                }
            })["CourseDetailsPage.useEffect"];
        }
    }["CourseDetailsPage.useEffect"], [
        course.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CourseDetailsPage.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
            if (reduceMotion.matches) return;
            const elements = Array.from(document.querySelectorAll("[data-reveal]"));
            if (!elements.length) return;
            const observer = new IntersectionObserver({
                "CourseDetailsPage.useEffect": (entries)=>{
                    entries.forEach({
                        "CourseDetailsPage.useEffect": (entry)=>{
                            if (entry.isIntersecting) {
                                entry.target.classList.add("is-revealed");
                                observer.unobserve(entry.target);
                            }
                        }
                    }["CourseDetailsPage.useEffect"]);
                }
            }["CourseDetailsPage.useEffect"], {
                threshold: 0.15
            });
            elements.forEach({
                "CourseDetailsPage.useEffect": (element)=>observer.observe(element)
            }["CourseDetailsPage.useEffect"]);
            return ({
                "CourseDetailsPage.useEffect": ()=>observer.disconnect()
            })["CourseDetailsPage.useEffect"];
        }
    }["CourseDetailsPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-8bded3d76d6908aa" + " " + "min-h-screen bg-slate-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-8bded3d76d6908aa" + " " + "relative overflow-hidden bg-gradient-to-l from-blue-950 via-blue-900 to-slate-900 text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-8bded3d76d6908aa" + " " + "container mx-auto px-4 pt-6 pb-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-3 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "secondary",
                                        size: "sm",
                                        asChild: true,
                                        className: "rounded-full transition-all duration-200 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/student/explore",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                    className: "ml-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                    lineNumber: 1036,
                                                    columnNumber: 17
                                                }, this),
                                                "العودة للاستكشاف"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                            lineNumber: 1035,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1029,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        className: "bg-white/10 text-white border border-white/20",
                                        children: course.category
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1040,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                lineNumber: 1028,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-8bded3d76d6908aa" + " " + "grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-8bded3d76d6908aa" + " " + "flex flex-col gap-4 text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "text-3xl md:text-4xl font-bold leading-tight motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300",
                                                children: course.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1047,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "text-lg text-blue-100 leading-relaxed motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:delay-100",
                                                children: course.shortDescription
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1050,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-blue-200",
                                                        children: "سعر الدورة"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1054,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-2xl font-bold",
                                                        children: formatYER(course.price)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1055,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1053,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "grid gap-3 text-sm text-blue-100 sm:grid-cols-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1059,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8bded3d76d6908aa",
                                                                children: [
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(course.startDate),
                                                                    " - ",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(course.endDate)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1060,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1058,
                                                        columnNumber: 17
                                                    }, this),
                                                    (course.startTime || course.endTime) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1066,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8bded3d76d6908aa",
                                                                children: [
                                                                    course.startTime ?? "",
                                                                    " ",
                                                                    course.endTime ? `- ${course.endTime}` : ""
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1067,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1065,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1073,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8bded3d76d6908aa",
                                                                children: [
                                                                    "المقاعد المتاحة: ",
                                                                    course.maxStudents
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1074,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1072,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-2",
                                                        children: [
                                                            course.deliveryType === "online" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1077,
                                                                columnNumber: 55
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1077,
                                                                columnNumber: 87
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8bded3d76d6908aa",
                                                                children: deliveryLabels[course.deliveryType]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1078,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1076,
                                                        columnNumber: 17
                                                    }, this),
                                                    course.onlinePlatform && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1082,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8bded3d76d6908aa",
                                                                children: [
                                                                    "المنصة: ",
                                                                    course.onlinePlatform
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1083,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1081,
                                                        columnNumber: 19
                                                    }, this),
                                                    course.hall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1088,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8bded3d76d6908aa",
                                                                children: course.hall.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1089,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1087,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1057,
                                                columnNumber: 15
                                            }, this),
                                            (course.meetingLink || registrationStatus === "PAYMENT_PENDING" || registrationStatus === "PENDING_APPROVAL" || registrationStatus === "PAYMENT_REJECTED") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "flex flex-wrap items-center gap-4",
                                                children: [
                                                    course.meetingLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: course.meetingLink,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-blue-200 underline underline-offset-4 self-start",
                                                        children: "رابط الاجتماع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1099,
                                                        columnNumber: 21
                                                    }, this),
                                                    registrationStatus === "PENDING_APPROVAL" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: handleTrainerApprovalSimulation,
                                                        disabled: isUpdatingStatus,
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-blue-200 underline underline-offset-4 self-start transition hover:text-white disabled:opacity-60",
                                                        children: "محاكاة الموافقة المبدئية"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1109,
                                                        columnNumber: 21
                                                    }, this),
                                                    registrationStatus === "PAYMENT_PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: handlePaymentApprovalSimulation,
                                                        disabled: isUpdatingStatus,
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-blue-200 underline underline-offset-4 self-start transition hover:text-white disabled:opacity-60",
                                                        children: "محاكاة تأكيد الدفع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1119,
                                                        columnNumber: 21
                                                    }, this),
                                                    registrationStatus === "PAYMENT_PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: handlePaymentRejectionSimulation,
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-blue-200 underline underline-offset-4 self-start transition hover:text-white",
                                                        children: "محاكاة رفض الدفع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1129,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1097,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "flex flex-wrap gap-2",
                                                children: course.tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "secondary",
                                                        className: "bg-white/10 text-white border border-white/10 transition-all duration-150 hover:bg-white/15 hover:-translate-y-0.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                className: "ml-1 h-3 w-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1146,
                                                                columnNumber: 21
                                                            }, this),
                                                            tag
                                                        ]
                                                    }, tag, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1141,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1139,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                                                open: isDialogOpen,
                                                onOpenChange: setIsDialogOpen,
                                                children: [
                                                    registrationStatus === "NONE" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        className: "w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 animate-cta-pop",
                                                        onClick: ()=>openRegistrationDialog("create"),
                                                        children: "التسجيل"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1153,
                                                        columnNumber: 17
                                                    }, this),
                                                    registrationStatus === "PENDING_APPROVAL" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "outline",
                                                        disabled: true,
                                                        className: "w-full rounded-full border-white/60 bg-white text-blue-900 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200 opacity-70 cursor-not-allowed",
                                                        children: "تم التسجيل مبدئيًا"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1161,
                                                        columnNumber: 17
                                                    }, this),
                                                    registrationStatus === "REJECTED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "outline",
                                                        className: "w-full rounded-full border-white/60 bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200",
                                                        onClick: ()=>openRegistrationDialog("edit"),
                                                        children: "تعديل التسجيل المبدئي"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1170,
                                                        columnNumber: 17
                                                    }, this),
                                                    registrationStatus === "APPROVED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        className: "w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200",
                                                        onClick: ()=>setIsPaymentDialogOpen(true),
                                                        children: "تأكيد الدفع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1179,
                                                        columnNumber: 17
                                                    }, this),
                                                    registrationStatus === "PAYMENT_PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "outline",
                                                        disabled: true,
                                                        className: "w-full rounded-full border-white/60 bg-white text-blue-900 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200 opacity-70 cursor-not-allowed",
                                                        children: "تم إرسال الدفع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1187,
                                                        columnNumber: 17
                                                    }, this),
                                                    registrationStatus === "PAYMENT_REJECTED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        className: "w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200",
                                                        onClick: ()=>setIsPaymentDialogOpen(true),
                                                        children: "تعديل سند الدفع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1196,
                                                        columnNumber: 17
                                                    }, this),
                                                    registrationStatus === "ENROLLED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        className: "w-full rounded-full bg-white text-blue-900 hover:bg-blue-50 text-base font-semibold h-12 sm:w-auto sm:px-10 transition-all duration-200",
                                                        onClick: ()=>{
                                                            saveEnrollment();
                                                            router.push(`/student/courses/${courseId}`);
                                                        },
                                                        children: "الانتقال إلى الدورة"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1204,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                                                        dir: "rtl",
                                                        className: "[&>button[data-dialog-close='default']]:hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogClose"], {
                                                                className: "absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1219,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "sr-only",
                                                                        children: "إغلاق"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1220,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1218,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                                                className: "space-y-3 text-right sm:text-right",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                                                        children: isEditMode ? "تعديل التسجيل المبدئي" : "التسجيل المبدئي"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1223,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                                                        className: "text-right",
                                                                        children: isEditMode ? "حدّث بيانات التسجيل المبدئي قبل إكمال الخطوات." : "أدخل بياناتك للتواصل وتأكيد التسجيل المبدئي."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1226,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1222,
                                                                columnNumber: 19
                                                            }, this),
                                                            formErrors.submit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-red-500 text-right",
                                                                children: formErrors.submit
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1233,
                                                                columnNumber: 21
                                                            }, this),
                                                            isLoadingRegistration ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-8bded3d76d6908aa" + " " + "space-y-4 py-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "h-4 w-24 rounded bg-slate-200/60"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1238,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "h-10 w-full rounded-lg bg-slate-200/60 animate-pulse"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1239,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1237,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "h-4 w-28 rounded bg-slate-200/60"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1242,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "h-10 w-full rounded-lg bg-slate-200/60 animate-pulse"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1243,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1241,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "h-4 w-24 rounded bg-slate-200/60"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1246,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "h-10 w-full rounded-lg bg-slate-200/60 animate-pulse"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1247,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1245,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1236,
                                                                columnNumber: 21
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-8bded3d76d6908aa" + " " + "space-y-4 py-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                htmlFor: "name",
                                                                                children: "الاسم الكامل"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1253,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                                id: "name",
                                                                                value: formData.name,
                                                                                onChange: (e)=>setFormData({
                                                                                        ...formData,
                                                                                        name: e.target.value
                                                                                    }),
                                                                                placeholder: "اكتب اسمك"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1254,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            formErrors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-red-500 text-right",
                                                                                children: formErrors.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1261,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1252,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                htmlFor: "email",
                                                                                children: "البريد الإلكتروني"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1265,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                                id: "email",
                                                                                value: formData.email,
                                                                                onChange: (e)=>setFormData({
                                                                                        ...formData,
                                                                                        email: e.target.value
                                                                                    }),
                                                                                placeholder: "name@email.com"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1266,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            formErrors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-red-500 text-right",
                                                                                children: formErrors.email
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1273,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1264,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                htmlFor: "phone",
                                                                                children: "رقم الهاتف"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1277,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                                id: "phone",
                                                                                value: formData.phone,
                                                                                onChange: (e)=>setFormData({
                                                                                        ...formData,
                                                                                        phone: e.target.value
                                                                                    }),
                                                                                placeholder: "05xxxxxxxx"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1278,
                                                                                columnNumber: 23
                                                                            }, this),
                                                                            formErrors.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-red-500 text-right",
                                                                                children: formErrors.phone
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1285,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1276,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    shouldShowSurvey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                children: "الاستبيان (اختياري)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1290,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-slate-600",
                                                                                        children: "الاستبيان اختياري، لكنه يساعدنا في تحسين تجربتك التعليمية."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                        lineNumber: 1292,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                        asChild: true,
                                                                                        variant: "outline",
                                                                                        size: "sm",
                                                                                        className: "h-9 rounded-full px-4",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                            href: course.surveyLink,
                                                                                            target: "_blank",
                                                                                            rel: "noopener noreferrer",
                                                                                            className: "jsx-8bded3d76d6908aa",
                                                                                            children: "فتح الاستبيان"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                            lineNumber: 1301,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                        lineNumber: 1295,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1291,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1289,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1251,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    onClick: handleRegister,
                                                                    disabled: isLoadingRegistration || isSubmitting,
                                                                    className: "w-full transition-all duration-200 hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2",
                                                                    children: isSubmitting ? "جارٍ الإرسال..." : isEditMode ? "حفظ التعديلات" : "تأكيد التسجيل"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                    lineNumber: 1311,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1310,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1214,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1151,
                                                columnNumber: 15
                                            }, this),
                                            registrationStatus === "PENDING_APPROVAL" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 text-right text-sm text-white/90 shadow-[0_8px_20px_rgba(15,23,42,0.18)] backdrop-blur",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "font-semibold",
                                                        children: "طلبك قيد المراجعة"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1328,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "mt-1 text-xs text-white/70",
                                                        children: "سيتم إشعارك عند اعتماد التسجيل من المدرب."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1329,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1327,
                                                columnNumber: 17
                                            }, this),
                                            registrationStatus === "PAYMENT_PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 text-right text-sm text-white/90 shadow-[0_8px_20px_rgba(15,23,42,0.18)] backdrop-blur",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "font-semibold",
                                                        children: "تم إرسال سند الدفع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1336,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "mt-1 text-xs text-white/70",
                                                        children: "جاري مراجعة الدفع من المدرب. سيتم إشعارك بعد التأكيد."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1337,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1335,
                                                columnNumber: 17
                                            }, this),
                                            registrationStatus === "PAYMENT_REJECTED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-right text-sm text-white/90 shadow-[0_8px_20px_rgba(15,23,42,0.18)] backdrop-blur",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "font-semibold text-red-200",
                                                        children: "تم رفض الدفع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1344,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "mt-1 text-xs text-red-100/80",
                                                        children: "يرجى تعديل سند الدفع وإعادة الإرسال."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1345,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1343,
                                                columnNumber: 17
                                            }, this),
                                            registrationStatus !== "NONE" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                dir: "rtl",
                                                className: "jsx-8bded3d76d6908aa" + " " + `mt-4 rounded-2xl border p-4 text-right text-sm backdrop-blur animate-stepper-reveal ${registrationStatus === "PENDING_APPROVAL" ? "border-white/10 bg-white/5 text-white/70 shadow-none opacity-75" : "border-white/15 bg-white/10 text-white/90 shadow-[0_8px_24px_rgba(15,23,42,0.2)]"}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-8bded3d76d6908aa" + " " + "relative flex flex-nowrap items-start gap-0 overflow-x-auto pb-1",
                                                    children: steps.map((step, index)=>{
                                                        const state = getStepState(step.id);
                                                        const isLast = index === steps.length - 1;
                                                        const circleClass = state === "completed" ? "bg-emerald-500 text-white" : state === "active" ? "bg-blue-500 text-white ring-4 ring-blue-400/30" : state === "rejected" ? "bg-red-500 text-white" : "border border-white/30 bg-slate-900/80 text-white/70";
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-8bded3d76d6908aa" + " " + "relative z-10 flex min-w-[88px] flex-col items-center text-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-8bded3d76d6908aa" + " " + `flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ease-in-out ${circleClass} ${state === "active" ? "animate-stepper-pop" : ""}`,
                                                                            children: [
                                                                                state === "completed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                    className: "h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                    lineNumber: 1382,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                state === "rejected" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                    className: "h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                    lineNumber: 1383,
                                                                                    columnNumber: 56
                                                                                }, this),
                                                                                state !== "completed" && state !== "rejected" && step.id
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                            lineNumber: 1377,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-8bded3d76d6908aa" + " " + "mt-2 text-xs font-medium text-white/90",
                                                                            children: step.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                            lineNumber: 1386,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                    lineNumber: 1376,
                                                                    columnNumber: 27
                                                                }, this),
                                                                !isLast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-8bded3d76d6908aa" + " " + "relative z-0 flex-1 -mx-5",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        "aria-hidden": "true",
                                                                        className: "jsx-8bded3d76d6908aa" + " " + `pointer-events-none absolute top-5 h-1 w-full -translate-y-1/2 rounded-full transition-colors duration-300 ${getConnectorClass(step.id)}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1392,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                    lineNumber: 1391,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, step.id, true, {
                                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                            lineNumber: 1375,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                    lineNumber: 1361,
                                                    columnNumber: 19
                                                }, this)
                                            }, registrationStatus, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1352,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1046,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-8bded3d76d6908aa" + " " + "relative -mt-4 aspect-square w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-lg animate-image-reveal",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: toggleFavorite,
                                                "aria-label": "إضافة إلى المفضلة",
                                                "aria-pressed": isFavorite,
                                                className: "jsx-8bded3d76d6908aa" + " " + `absolute left-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-slate-200 backdrop-blur transition-all duration-200 hover:scale-105 hover:text-white ${isFavorite ? "text-red-500 hover:text-red-500" : ""}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                                    className: `h-5 w-5 transition-all duration-200 ${isFavorite ? "fill-current scale-110" : ""}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                    lineNumber: 1417,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1408,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: course.image,
                                                alt: course.title,
                                                fill: true,
                                                className: "object-cover",
                                                sizes: "(max-width: 1024px) 360px, 420px"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1423,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1407,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                lineNumber: 1045,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                        lineNumber: 1027,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-8bded3d76d6908aa" + " " + "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-slate-50"
                    }, void 0, false, {
                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                        lineNumber: 1433,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/courses/[id]/page.tsx",
                lineNumber: 1026,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-8bded3d76d6908aa" + " " + "container mx-auto px-4 py-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        dir: "rtl",
                        className: "mb-6 w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
                        "data-reveal": true,
                        style: {
                            "--reveal-delay": "0ms"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-8bded3d76d6908aa" + " " + "text-right space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "jsx-8bded3d76d6908aa" + " " + "text-base sm:text-lg font-bold text-slate-900",
                                    children: "معلومات المدرب"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1444,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-8bded3d76d6908aa" + " " + "flex items-start gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-8bded3d76d6908aa" + " " + "relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: course.instructor.avatar,
                                                alt: course.instructor.name,
                                                fill: true,
                                                className: "object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1449,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                            lineNumber: 1448,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-8bded3d76d6908aa" + " " + "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "jsx-8bded3d76d6908aa" + " " + "text-lg font-bold text-slate-900",
                                                    children: course.instructor.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                    lineNumber: 1457,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-slate-600",
                                                    children: course.instructor.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                    lineNumber: 1460,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-8bded3d76d6908aa" + " " + "text-sm text-slate-500 line-clamp-2 max-w-[560px]",
                                                    children: course.instructor.bio
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                    lineNumber: 1461,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                            lineNumber: 1456,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1447,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                            lineNumber: 1443,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                        lineNumber: 1437,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-8bded3d76d6908aa" + " " + "grid gap-6 lg:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "h-full transition-shadow duration-200 hover:shadow-md reveal-card",
                                "data-reveal": true,
                                style: {
                                    "--reveal-delay": "0ms"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "عن الدورة"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                            lineNumber: 1476,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1475,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "text-sm leading-7 text-slate-700",
                                        children: course.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1478,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                lineNumber: 1470,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "h-full transition-shadow duration-200 hover:shadow-md reveal-card",
                                "data-reveal": true,
                                style: {
                                    "--reveal-delay": "100ms"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "أهداف الدورة"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                            lineNumber: 1489,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1488,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "grid gap-3 text-sm",
                                        children: course.objectives.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "flex items-start gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "mt-1 h-2 w-2 rounded-full bg-blue-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1494,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-slate-700",
                                                        children: item
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1495,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1493,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1491,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                lineNumber: 1483,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "h-full transition-shadow duration-200 hover:shadow-md reveal-card",
                                "data-reveal": true,
                                style: {
                                    "--reveal-delay": "200ms"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "المتطلبات"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                            lineNumber: 1507,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1506,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "space-y-2 text-sm",
                                        children: course.prerequisites.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "flex items-start gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "mt-1 h-2 w-2 rounded-full bg-slate-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1512,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-slate-700",
                                                        children: item
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1513,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1511,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1509,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                lineNumber: 1501,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "h-full transition-shadow duration-200 hover:shadow-md reveal-card",
                                "data-reveal": true,
                                style: {
                                    "--reveal-delay": "300ms"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            children: "الجدول الزمني"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                            lineNumber: 1525,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1524,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "space-y-3",
                                        children: course.schedule.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-2 text-slate-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                className: "h-4 w-4 text-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1531,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8bded3d76d6908aa",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(item.date)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1532,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1530,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-center gap-2 text-slate-600",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1535,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-8bded3d76d6908aa",
                                                                children: [
                                                                    item.startTime,
                                                                    " - ",
                                                                    item.endTime
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1536,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1534,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, `${item.date}-${index}`, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1529,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1527,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                lineNumber: 1519,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                        lineNumber: 1469,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/courses/[id]/page.tsx",
                lineNumber: 1436,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isPaymentDialogOpen,
                onOpenChange: setIsPaymentDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    dir: "rtl",
                    className: "max-w-3xl [&>button[data-dialog-close='default']]:hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogClose"], {
                            className: "absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1552,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-8bded3d76d6908aa" + " " + "sr-only",
                                    children: "إغلاق"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1553,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                            lineNumber: 1551,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            className: "space-y-2 text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    className: "text-right",
                                    children: registrationStatus === "PAYMENT_REJECTED" ? "تعديل سند الدفع" : "تأكيد الدفع"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1556,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    className: "text-right",
                                    children: "يرجى تحويل المبلغ وإرفاق سند الدفع لإكمال الخطوة."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1559,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                            lineNumber: 1555,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-8bded3d76d6908aa" + " " + "grid gap-4 pt-4 lg:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-8bded3d76d6908aa" + " " + "order-2 space-y-4 text-right lg:order-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-8bded3d76d6908aa" + " " + "rounded-2xl border border-slate-200 bg-white p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-base font-semibold text-slate-900",
                                                        children: "رفع سند الدفع"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1567,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-slate-500",
                                                        children: "صور أو PDF"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1568,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1566,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onDragOver: (event)=>{
                                                    event.preventDefault();
                                                    setIsDraggingFile(true);
                                                },
                                                onDragLeave: ()=>setIsDraggingFile(false),
                                                onDrop: (event)=>{
                                                    event.preventDefault();
                                                    setIsDraggingFile(false);
                                                    const file = event.dataTransfer.files?.[0] ?? null;
                                                    handleReceiptFile(file);
                                                },
                                                onClick: ()=>paymentFileRef.current?.click(),
                                                className: "jsx-8bded3d76d6908aa" + " " + `mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-5 text-sm transition ${isDraggingFile ? "border-blue-500 bg-blue-50/60" : "border-slate-200 bg-slate-50/60"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__["UploadCloud"], {
                                                        className: "h-6 w-6 text-blue-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1587,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "font-medium text-slate-700",
                                                        children: "اسحب الملف هنا"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1588,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-slate-500",
                                                        children: "أو اختر ملفًا من جهازك"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1589,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        size: "sm",
                                                        className: "rounded-full",
                                                        children: "اختيار ملف"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1590,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        ref: paymentFileRef,
                                                        type: "file",
                                                        accept: "image/*,.pdf",
                                                        className: "hidden",
                                                        onChange: (event)=>{
                                                            const file = event.target.files?.[0] ?? null;
                                                            handleReceiptFile(file);
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1593,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1570,
                                                columnNumber: 17
                                            }, this),
                                            (receiptFile?.name || receiptInfo.name) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "mt-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "flex items-start gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                className: "mt-0.5 h-4 w-4 text-slate-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1607,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-8bded3d76d6908aa" + " " + "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "font-semibold text-slate-900",
                                                                        children: receiptFile?.name ?? receiptInfo.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1609,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    receiptFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-[11px] text-slate-500",
                                                                        children: [
                                                                            receiptFile.type || "ملف",
                                                                            " · ",
                                                                            formatFileSize(receiptFile.size)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1613,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1608,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                type: "button",
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>{
                                                                    setReceiptFile(null);
                                                                    setReceiptInfo((prev)=>({
                                                                            ...prev,
                                                                            name: ""
                                                                        }));
                                                                },
                                                                className: "h-7 rounded-full px-3 text-xs",
                                                                children: "إزالة الملف"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1618,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1606,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "mt-2 flex gap-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            type: "button",
                                                            variant: "outline",
                                                            size: "sm",
                                                            onClick: ()=>paymentFileRef.current?.click(),
                                                            className: "h-7 rounded-full px-3 text-xs",
                                                            children: "تغيير الملف"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                            lineNumber: 1632,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1631,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1605,
                                                columnNumber: 19
                                            }, this),
                                            !receiptFile?.name && !receiptInfo.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "mt-3 text-xs text-slate-500",
                                                children: "ارفع سند الدفع أولاً حتى تتمكن من التأكيد."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1645,
                                                columnNumber: 19
                                            }, this),
                                            paymentError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "mt-2 text-xs text-red-500",
                                                children: paymentError
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1649,
                                                columnNumber: 34
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1565,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1564,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-8bded3d76d6908aa" + " " + "order-1 space-y-4 text-right lg:order-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-8bded3d76d6908aa" + " " + "rounded-2xl border border-slate-200 bg-white p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-base font-semibold text-slate-900",
                                                        children: "الحسابات البنكية"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1655,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-slate-500",
                                                        children: "اختر بنكًا لعرض التفاصيل"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1656,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1654,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-8bded3d76d6908aa" + " " + "mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1",
                                                children: bankAccounts.map((bank)=>{
                                                    const isOpen = expandedBankId === bank.id;
                                                    const hasIban = Boolean(bank.iban);
                                                    const hasAccountNumber = Boolean(bank.accountNumber);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-8bded3d76d6908aa" + " " + "rounded-xl border border-slate-200 bg-white",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setExpandedBankId((prev)=>prev === bank.id ? null : bank.id),
                                                                "aria-expanded": isOpen,
                                                                className: "jsx-8bded3d76d6908aa" + " " + "flex w-full items-center justify-between gap-3 px-4 py-3 text-right",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-sm font-semibold text-slate-900",
                                                                        children: bank.bankName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1673,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                        className: `h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1676,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1665,
                                                                columnNumber: 25
                                                            }, this),
                                                            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-8bded3d76d6908aa" + " " + "border-t border-slate-200 px-4 py-3 text-right text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-slate-500",
                                                                        children: [
                                                                            "اسم المستفيد: ",
                                                                            bank.beneficiary
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1684,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    hasIban && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "mt-3 space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-slate-500",
                                                                                children: "رقم IBAN"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1689,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "font-mono text-sm font-semibold text-slate-900",
                                                                                children: bank.iban
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1690,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                type: "button",
                                                                                variant: "outline",
                                                                                size: "sm",
                                                                                onClick: ()=>handleCopyValue(bank.iban, "رقم الآيبان"),
                                                                                className: "h-7 rounded-full px-3 text-xs",
                                                                                children: "نسخ IBAN"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1693,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1688,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    !hasIban && hasAccountNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-8bded3d76d6908aa" + " " + "mt-3 space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "text-xs text-slate-500",
                                                                                children: "رقم الحساب"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1706,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-8bded3d76d6908aa" + " " + "font-mono text-sm font-semibold text-slate-900",
                                                                                children: bank.accountNumber
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1707,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                type: "button",
                                                                                variant: "outline",
                                                                                size: "sm",
                                                                                onClick: ()=>handleCopyValue(bank.accountNumber ?? "", "رقم الحساب"),
                                                                                className: "h-7 rounded-full px-3 text-xs",
                                                                                children: "نسخ رقم الحساب"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                                lineNumber: 1710,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                        lineNumber: 1705,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                                lineNumber: 1683,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, bank.id, true, {
                                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                        lineNumber: 1664,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/courses/[id]/page.tsx",
                                                lineNumber: 1658,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/courses/[id]/page.tsx",
                                        lineNumber: 1653,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1652,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                            lineNumber: 1563,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "mt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handlePaymentConfirmation,
                                    disabled: isUpdatingStatus || !receiptFile?.name && !receiptInfo.name,
                                    className: "w-full",
                                    children: "تأكيد الدفع"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1733,
                                    columnNumber: 13
                                }, this),
                                !receiptFile?.name && !receiptInfo.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-8bded3d76d6908aa" + " " + "mt-2 text-xs text-red-500 text-right",
                                    children: "ارفع السند أولاً لتفعيل زر التأكيد."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                                    lineNumber: 1741,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/courses/[id]/page.tsx",
                            lineNumber: 1732,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/courses/[id]/page.tsx",
                    lineNumber: 1547,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/courses/[id]/page.tsx",
                lineNumber: 1546,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "8bded3d76d6908aa",
                children: "@keyframes cta-pop{0%{transform:scale(1)}50%{transform:scale(1.02)}to{transform:scale(1)}}@keyframes image-reveal{0%{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}.animate-cta-pop{animation:.26s ease-out cta-pop}.animate-image-reveal{animation:.32s ease-out image-reveal}.reveal-card{opacity:0;transition:opacity .26s,transform .26s,box-shadow .2s;transition-delay:var(--reveal-delay,0s);transform:translateY(12px)}.reveal-card.is-revealed{opacity:1;transform:translateY(0)}@keyframes stepper-reveal{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.animate-stepper-reveal{animation:.32s ease-out stepper-reveal}@keyframes stepper-pop{0%{transform:scale(1)}60%{transform:scale(1.06)}to{transform:scale(1)}}.animate-stepper-pop{animation:.32s ease-in-out stepper-pop}@media (prefers-reduced-motion:reduce){.reveal-card{opacity:1;transition:none;transform:none}.animate-cta-pop,.animate-image-reveal{animation:none}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/courses/[id]/page.tsx",
        lineNumber: 1025,
        columnNumber: 5
    }, this);
}
_s(CourseDetailsPage, "8mL/o1NrFHTIfeKGW2kGTDWE4Rs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CourseDetailsPage;
var _c;
__turbopack_context__.k.register(_c, "CourseDetailsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_a583daba._.js.map