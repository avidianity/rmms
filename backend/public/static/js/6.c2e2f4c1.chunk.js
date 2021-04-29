(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[6],{113:function(e,t,c){"use strict";var a=c(1),n=c(0);t.a=Object(a.forwardRef)((function(e,t){var c=e.title,a=e.id,r=e.children,s=e.buttons;return Object(n.jsx)("div",{id:a,className:"modal fade",tabIndex:-1,role:"dialog",ref:t,children:Object(n.jsx)("div",{className:"modal-dialog modal-lg modal-dialog-centered",role:"document",children:Object(n.jsxs)("div",{className:"modal-content",children:[Object(n.jsxs)("div",{className:"modal-header",children:[Object(n.jsx)("h5",{className:"modal-title",children:c}),Object(n.jsx)("button",{type:"button",className:"close","data-dismiss":"modal","aria-label":"Close",children:Object(n.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),Object(n.jsx)("div",{className:"modal-body",children:r}),Object(n.jsxs)("div",{className:"modal-footer",children:[s,Object(n.jsxs)("button",{type:"button",className:"btn btn-primary btn-sm","data-dismiss":"modal",children:[Object(n.jsx)("i",{className:"material-icons",children:"close"}),"Close"]})]})]})})})}))},261:function(e,t,c){"use strict";c.r(t);var a=c(1),n=c(4),r=c(2),s=c.n(r),i=c(6),l=c(7),d=c(3),o=c.n(d),u=c(21),b=c.n(u),j=c(32),h=c(90),m=c(11),p=c(14),O=c(87),x=c(85),v=c(16),f=c.n(v),N=c(86),g=c(0),k=function(e){var t=Object(a.useState)([]),c=Object(l.a)(t,2),r=c[0],d=c[1],u=Object(a.useState)(Object(m.c)()),v=Object(l.a)(u,2),k=v[0],y=v[1],_=Object(n.h)(),w=function(e){return"".concat(_.path).concat(e)},M=function(){var e=Object(i.a)(s.a.mark((function e(t){var c,a,n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,c=p.a.get("prescription-page")||1,e.next=4,o.a.get(t||"/pharmacy/prescriptions?page=".concat(c));case 4:a=e.sent,n=a.data,d(n.data),y(n),p.a.set("prescription-page",n.current_page),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),Object(m.b)(e.t0);case 14:case"end":return e.stop()}}),e,null,[[0,11]])})));return function(t){return e.apply(this,arguments)}}(),R=function(){var e=Object(i.a)(s.a.mark((function e(t){var c,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o.a.get("/search?model=Prescription&keyword=".concat(encodeURIComponent(t),"&paginate=false"));case 3:c=e.sent,a=c.data,d(a),y(Object(m.c)()),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),console.log(e.t0.toJSON()),f.a.error("Unable to search.");case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t){return e.apply(this,arguments)}}(),D=p.a.get("user");return Object(a.useEffect)((function(){M();var e=N.b.listen("submit",(function(e){e.length>0?R(e):M()}));return function(){N.b.unlisten("submit",e)}}),[]),Object(g.jsx)(g.Fragment,{children:Object(g.jsx)(x.a,{title:"Prescriptions",head:function(){return Object(g.jsxs)("tr",{children:[Object(g.jsx)("th",{children:"ID"}),Object(g.jsx)("th",{children:"Patient"}),Object(g.jsx)("th",{children:"Doctor"}),Object(g.jsx)("th",{children:"Type of Record"}),Object(g.jsx)("th",{children:"Case Number"}),Object(g.jsx)("th",{children:"Released"}),Object(g.jsx)("th",{colSpan:3,children:"Actions"})]})},foot:function(){return Object(g.jsx)(O.a,{pagination:k,onChange:function(e){return M(e)}})},children:r.map((function(e,t){var c,a=e.id,n=e.released_at,r=e.recordable,s=e.recordable_type,i=e.doctor,l=e.doctor_id;return Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{children:a}),Object(g.jsx)("td",{children:null===r||void 0===r||null===(c=r.patient)||void 0===c?void 0:c.name}),Object(g.jsx)("td",{children:null===i||void 0===i?void 0:i.name}),Object(g.jsx)("td",{children:h.a[s.split("\\")[2]]}),Object(g.jsx)("td",{children:b()(null===r||void 0===r?void 0:r.case_number).format("MMMM DD, YYYY")}),Object(g.jsx)("td",{children:n?b()(n).format("MMMM DD, YYYY hh:mm A"):"N/A"}),Object(g.jsxs)("td",{children:[Object(g.jsxs)(j.b,{to:w("/".concat(a)),className:"btn btn-info btn-sm",title:"View",children:[Object(g.jsx)("i",{className:"material-icons mr-1",children:"visibility"}),"View"]}),null===n&&l===D.id?Object(g.jsxs)(j.b,{to:w("/".concat(a,"/edit")),className:"btn btn-warning btn-sm",title:"Edit",children:[Object(g.jsx)("i",{className:"material-icons mr-1",children:"create"}),"Edit"]}):null]})]},t)}))})})},y=c(113),_=c(93),w=c.n(_),M=function(e){var t,c,r,d,u=Object(a.useState)(null),j=Object(l.a)(u,2),O=j[0],v=j[1],N=Object(n.g)().id,k=Object(n.f)(),_=Object(a.useState)(new Date),M=Object(l.a)(_,2),R=M[0],D=M[1],P=Object(a.useState)(!1),Y=Object(l.a)(P,2),C=Y[0],S=Y[1],I=Object(a.createRef)(),E=p.a.get("user"),A=function(){var e=Object(i.a)(s.a.mark((function e(t){var c,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o.a.get("/pharmacy/prescriptions/".concat(t));case 3:c=e.sent,a=c.data,v(a),e.next=12;break;case 8:e.prev=8,e.t0=e.catch(0),Object(m.b)(e.t0),k.goBack();case 12:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t){return e.apply(this,arguments)}}(),J=function(){var e=Object(i.a)(s.a.mark((function e(){var t,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return S(!0),e.prev=1,e.next=4,o.a.put("/pharmacy/prescriptions/".concat(N),{released_at:R.toJSON()});case 4:t=e.sent,c=t.data,v(c),f.a.success("Prescription marked as Released.","Success!"),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),Object(m.b)(e.t0);case 13:return e.prev=13,S(!1),e.finish(13);case 16:case"end":return e.stop()}}),e,null,[[1,10,13,16]])})));return function(){return e.apply(this,arguments)}}();return Object(a.useEffect)((function(){A(N)}),[]),Object(g.jsxs)("div",{className:"container-fluid",children:[Object(g.jsxs)("div",{className:"card",children:[Object(g.jsxs)("div",{className:"card-header card-header-success d-flex align-items-center",children:[Object(g.jsx)("h4",{className:"card-title",children:"View Prescription"}),"Pharmacist"===(null===E||void 0===E?void 0:E.role)?Object(g.jsxs)("button",{className:"btn btn-info btn-sm ml-auto",disabled:C||null!==(null===O||void 0===O?void 0:O.released_at),onClick:function(e){e.preventDefault(),I.current&&null===(null===O||void 0===O?void 0:O.released_at)&&$(I.current).modal("show")},children:[Object(g.jsx)("i",{className:"material-icons mr-1",children:"local_shipping"}),null===(null===O||void 0===O?void 0:O.released_at)?"Mark as Released":"Released"]}):null]}),Object(g.jsxs)("div",{className:"card-body",children:[Object(g.jsxs)("p",{className:"card-text",children:["Patient: ",null===O||void 0===O||null===(t=O.recordable)||void 0===t||null===(c=t.patient)||void 0===c?void 0:c.name]}),Object(g.jsxs)("p",{className:"card-text",children:["Doctor: ",null===O||void 0===O||null===(r=O.doctor)||void 0===r?void 0:r.name]}),Object(g.jsxs)("p",{className:"card-text",children:["Status: ",(null===O||void 0===O?void 0:O.released_at)?b()(null===O||void 0===O?void 0:O.released_at).format("MMMM DD, YYYY hh:mm A"):"Pending"]}),Object(g.jsx)("div",{className:"container-fluid",children:Object(g.jsxs)("div",{className:"card",children:[Object(g.jsx)("div",{className:"card-header",children:Object(g.jsx)("h6",{className:"card-title",children:"Record Information"})}),Object(g.jsxs)("div",{className:"card-body",children:[Object(g.jsxs)("p",{className:"card-text",children:["Type:"," ",(null===O||void 0===O?void 0:O.recordable_type)?h.a[O.recordable_type.split("\\")[2]]:null]}),Object(g.jsxs)("p",{className:"card-text",children:["Case Number:"," ",(null===O||void 0===O?void 0:O.recordable)?b()(O.recordable.case_number).format("MMMM DD, YYYY"):null]}),(null===O||void 0===O?void 0:O.recordable_type)&&"Regular Record"===h.a[null===O||void 0===O?void 0:O.recordable_type]?Object(g.jsxs)("p",{className:"card-text",children:["Diagnosis: ",(null===O||void 0===O?void 0:O.recordable).diagnosis]}):null]})]})}),Object(g.jsx)("div",{className:"container-fluid",children:Object(g.jsx)(x.a,{title:"Items",head:function(){return Object(g.jsxs)("tr",{children:[Object(g.jsx)("th",{children:"ID"}),Object(g.jsx)("th",{children:"Medicine"}),Object(g.jsx)("th",{children:"Quantity"})]})},children:null===O||void 0===O||null===(d=O.items)||void 0===d?void 0:d.map((function(e,t){var c;return Object(g.jsxs)("tr",{children:[Object(g.jsx)("td",{children:e.id}),Object(g.jsx)("td",{children:null===(c=e.medicine)||void 0===c?void 0:c.description}),Object(g.jsx)("td",{children:e.quantity})]},t)}))})})]})]}),Object(g.jsx)(y.a,{ref:I,title:"Mark Prescription as Released",buttons:Object(g.jsx)("button",{className:"btn btn-success btn-sm",disabled:C,onClick:function(e){e.preventDefault(),J(),I.current&&$(I.current).modal("hide")},children:C?Object(g.jsx)("i",{className:"material-icons spin",children:"refresh"}):"Submit"}),children:Object(g.jsxs)("div",{className:"form-group bmd-form-group is-filled",children:[Object(g.jsx)("label",{className:"bmd-label-floating",children:"Date and Time"}),Object(g.jsx)(w.a,{className:"form-control","data-enable-time":!0,value:R,onChange:function(e){D(e[0])},disabled:C})]})})]})};t.default=function(e){var t=Object(n.h)(),c=function(e){return"".concat(t.path).concat(e)};return Object(g.jsxs)(n.c,{children:[Object(g.jsx)(n.a,{path:c(""),exact:!0,component:k}),Object(g.jsx)(n.a,{path:c("/:id"),exact:!0,component:M})]})}},85:function(e,t,c){"use strict";c(1);var a=c(0);t.a=function(e){var t=e.title,c=e.subtitles,n=e.head,r=e.children,s=e.foot,i=e.className;return Object(a.jsxs)("div",{className:"card ".concat(i),children:[Object(a.jsxs)("div",{className:"card-header card-header-success",children:[Object(a.jsx)("h4",{className:"card-title",children:t}),c?Object(a.jsx)("p",{className:"card-category",children:c}):null]}),Object(a.jsx)("div",{className:"card-body",children:Object(a.jsx)("div",{className:"table-responsive",children:Object(a.jsxs)("table",{className:"table",children:[Object(a.jsx)("thead",{className:"text-success",children:n()}),Object(a.jsx)("tbody",{children:r})]})})}),s?Object(a.jsx)("div",{className:"card-footer",children:s()}):null]})}},86:function(e,t,c){"use strict";c.d(t,"b",(function(){return i})),c.d(t,"a",(function(){return l}));var a=c(22),n=c(23),r=function(){function e(t){Object(a.a)(this,e),this.key=void 0,this.key=t}return Object(n.a)(e,[{key:"getKey",value:function(){return this.key}}]),e}(),s=function(){function e(){Object(a.a)(this,e),this.callbacks={}}return Object(n.a)(e,[{key:"dispatch",value:function(e,t){return e in this.callbacks?(this.callbacks[e].forEach((function(e){return e(t)})),this):this}},{key:"listen",value:function(e,t){return e in this.callbacks||(this.callbacks[e]=[]),new r(this.callbacks[e].push(t)-1)}},{key:"unlisten",value:function(e,t){e in this.callbacks&&this.callbacks[e].splice(t.getKey(),1)}}]),e}(),i=new s,l=new s},87:function(e,t,c){"use strict";c.d(t,"a",(function(){return r}));c(1);var a=c(11),n=c(0);function r(e){var t=e.pagination,c=e.onChange,r=e.small,s=t.links.filter((function(e){return Number.isInteger(Number(e.label))})),i=function(e){return function(t){t.preventDefault(),e&&c(e)}};return t.total<=t.per_page?null:Object(n.jsx)("nav",{"aria-label":"Page Navigation",children:Object(n.jsxs)("ul",{className:"pagination ".concat(Object(a.d)(Object(a.f)(r),"pagination-sm")),children:[Object(n.jsx)("li",{className:"page-item ".concat(Object(a.d)(null===t.prev_page_url,"disabled")),children:Object(n.jsxs)("a",{className:"page-link",href:"".concat(t.prev_page_url),onClick:i(t.prev_page_url),children:[Object(n.jsx)("span",{"aria-hidden":"true",children:"<"}),Object(n.jsx)("span",{className:"sr-only",children:"Previous"})]})}),s.map((function(e,t){var c=e.active,r=e.label,s=e.url;return Object(n.jsx)("li",{className:"page-item ".concat(Object(a.d)(c,"active")),children:Object(n.jsx)("a",{className:"page-link",href:"".concat(s),onClick:i(s),children:r})},t)})),Object(n.jsx)("li",{className:"page-item ".concat(Object(a.d)(null===t.next_page_url,"disabled")),children:Object(n.jsxs)("a",{className:"page-link",href:"".concat(t.next_page_url),onClick:i(t.next_page_url),children:[Object(n.jsx)("span",{"aria-hidden":"true",children:">"}),Object(n.jsx)("span",{className:"sr-only",children:"Next"})]})})]})})}},90:function(e,t,c){"use strict";c.d(t,"a",(function(){return a})),c.d(t,"b",(function(){return n}));var a={Record:"Regular Record",PrenatalRecord:"Prenatal Record"},n={RegularRecord:["Pending","Done"],PrenatalRecord:["Pending","Done"],Immunization:{fields:[{key:"bcg",name:"BCG"},{key:"penta",name:"Penta"},{key:"opv",name:"OPV"},{key:"hepa_b",name:"Hepa B"},{key:"mmr",name:"MMR"},{key:"measles",name:"Measles"},{key:"other",name:"Other"}],properties:["at_birth","six_weeks","fourteen_weeks","nine_months"]}}}}]);
//# sourceMappingURL=6.c2e2f4c1.chunk.js.map