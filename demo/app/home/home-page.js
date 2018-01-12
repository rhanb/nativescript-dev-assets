"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var home_view_model_1 = require("./home-view-model");
/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = new home_view_model_1.HomeViewModel();
}
exports.onNavigatingTo = onNavigatingTo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaG9tZS1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EscURBQWtEO0FBRWxEOzs4REFFOEQ7QUFDOUQsd0JBQStCLElBQW1CO0lBQzlDLElBQU0sSUFBSSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSwrQkFBYSxFQUFFLENBQUM7QUFDOUMsQ0FBQztBQUhELHdDQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2tMYXlvdXQgfSBmcm9tIFwidWkvbGF5b3V0cy9zdGFjay1sYXlvdXRcIjtcbmltcG9ydCB7IE5hdmlnYXRlZERhdGEgfSBmcm9tIFwidWkvcGFnZVwiO1xuXG5pbXBvcnQgeyBIb21lVmlld01vZGVsIH0gZnJvbSBcIi4vaG9tZS12aWV3LW1vZGVsXCI7XG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIFVzZSB0aGUgXCJvbk5hdmlnYXRpbmdUb1wiIGhhbmRsZXIgdG8gaW5pdGlhbGl6ZSB0aGUgcGFnZSBiaW5kaW5nIGNvbnRleHQuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uTmF2aWdhdGluZ1RvKGFyZ3M6IE5hdmlnYXRlZERhdGEpIHtcbiAgICBjb25zdCBwYWdlID0gPFN0YWNrTGF5b3V0PmFyZ3Mub2JqZWN0O1xuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBuZXcgSG9tZVZpZXdNb2RlbCgpO1xufVxuIl19