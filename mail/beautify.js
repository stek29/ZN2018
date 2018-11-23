var require = meteorInstall(
  {
    client: {
      "main.html": [
        "./template.main.js",
        function(e, t, n) {
          n.exports = e("./template.main.js");
        }
      ],
      "template.main.js": function() {
        Template.body.addContent(function() {
          var e = this;
          return "";
        }),
          Meteor.startup(Template.body.renderToDocument),
          Template.__checkName("securityState"),
          (Template.securityState = new Template(
            "Template.securityState",
            function() {
              var e = this;
              return HTML.DIV(
                HTML.Raw("\n      <h1>Mail security monitoring</h1>\n      "),
                HTML.DIV(
                  "Safe from internal attacker: ",
                  HTML.B(
                    Blaze.View("lookup:internalSafe", function() {
                      return Spacebars.mustache(e.lookup("internalSafe"));
                    })
                  )
                ),
                "\n      ",
                HTML.DIV(
                  "Safe from external attacker: ",
                  HTML.B(
                    Blaze.View("lookup:externalSafe", function() {
                      return Spacebars.mustache(e.lookup("externalSafe"));
                    })
                  )
                ),
                HTML.Raw(
                  '\n      <br>\n      Next-gen email security solution of Enterprise level.\n      <br>\n      <br>\n      <img width="100px" height="100px" src="apache.png">\n'
                )
              );
            }
          ));
      },
      "main.js": [
        "meteor/meteor",
        "meteor/templating",
        "../imports/api/apis.js",
        "./main.html",
        function(e, t, n) {
          var r;
          n["import"]("meteor/meteor", {
            Meteor: function(e) {
              r = e;
            }
          });
          var i;
          n["import"]("meteor/templating", {
            Template: function(e) {
              i = e;
            }
          });
          var o;
          n["import"]("../imports/api/apis.js", {
            SecurityState: function(e) {
              o = e;
            }
          }),
            n["import"]("./main.html"),
            i.securityState.onCreated(
              (function() {
                function e() {
                  r.subscribe("securityState");
                }
                return e;
              })()
            ),
            r.startup(function() {});
        }
      ]
    },
    imports: {
      api: {
        "apis.js": [
          "meteor/meteor",
          "meteor/mongo",
          "meteor/iron:router",
          "net",
          "meteor-node-stubs/deps/net",
          function(e, t, n) {
            function r(e) {
              var t = s.connect(
                "/tmp/arduino",
                function() {
                  t.write(e), t.end();
                }
              );
              t.on("error", function() {});
            }
            n["export"]({
              SecurityState: function() {
                return u;
              }
            });
            var i;
            n["import"]("meteor/meteor", {
              Meteor: function(e) {
                i = e;
              }
            });
            var o;
            n["import"]("meteor/mongo", {
              Mongo: function(e) {
                o = e;
              }
            });
            var a;
            n["import"]("meteor/iron:router", {
              Router: function(e) {
                a = e;
              }
            });
            var s;
            n["import"]("net", {
              default: function(e) {
                s = e;
              }
            });
            var u = new o.Collection("security");
            a.configure({ noRoutesTemplate: "securityState" }),
              a.route("/", function() {
                this.render("securityState", { data: u.findOne({}) });
              }),
              a.route(
                "/turn",
                function() {
                  var e = this.params.query,
                    t = this.response;
                  if (e["switch"] && e.enable && e.token)
                    if ("internal" === e["switch"])
                      if ("1" === e.enable) {
                        var n = u.findOne();
                        n.internalCode === e.token
                          ? (r("2"),
                            u.update(
                              {},
                              { $set: { internalSafe: !1 } },
                              function(e, n) {
                                t.end(e ? "Error" : "Switched");
                              }
                            ))
                          : this.response.end("Wrong token");
                      } else if ("0" === e.enable) {
                        var n = u.findOne();
                        n.internalCode === e.token
                          ? (r("1"),
                            u.update(
                              {},
                              { $set: { internalSafe: !0 } },
                              function(e, n) {
                                t.end(e ? "Error" : "Switched");
                              }
                            ))
                          : this.response.end("Wrong token");
                      } else this.response.end("Enable should be 1 or 0");
                    else if ("external" === e["switch"])
                      if ("1" === e.enable) {
                        var n = u.findOne();
                        n.externalCode === e.token
                          ? (r("3"),
                            u.update(
                              {},
                              { $set: { externalSafe: !1 } },
                              function(e, n) {
                                t.end(e ? "Error" : "Switched");
                              }
                            ))
                          : this.response.end("Wrong token");
                      } else if ("0" === e.enable) {
                        var n = u.findOne();
                        n.externalCode === e.token
                          ? (r("1"),
                            u.update(
                              {},
                              { $set: { externalSafe: !0 } },
                              function(e, n) {
                                t.end(e ? "Error" : "Switched");
                              }
                            ))
                          : this.response.end("Wrong token");
                      } else this.response.end("Enable should be 1 or 0");
                    else this.response.end("Unknown switch");
                  else this.response.end("Missing params");
                },
                { where: "server" }
              ),
              i.isServer &&
                i.publish(
                  "securityState",
                  (function() {
                    function e() {
                      return u.find(
                        {},
                        { fields: { internalSafe: 1, externalSafe: 1 } }
                      );
                    }
                    return e;
                  })()
                ),
              i.methods({
                debugSwitch: (function() {
                  function e(e, t) {
                    var n = { internalSafe: 1, externalSafe: 1 };
                    for (var r in meteorBabelHelpers.sanitizeForInObject(t));
                    return u.find(e, { fields: n }).fetch();
                  }
                  return e;
                })()
              });
          }
        ]
      }
    }
  },
  { extensions: [".js", ".json", ".html", ".css"] }
);
require("./client/template.main.js"), require("./client/main.js");
