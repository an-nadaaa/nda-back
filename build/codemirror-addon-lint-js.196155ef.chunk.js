(self.webpackChunknda_back=self.webpackChunknda_back||[]).push([[953],{96477:(n,e,r)=>{!function(n){"use strict";function e(n,e){if(!window.JSHINT)return window.console&&window.console.error("Error: window.JSHINT not defined, CodeMirror JavaScript linting cannot run."),[];e.indent||(e.indent=1),JSHINT(n,e,e.globals);var i=JSHINT.data().errors,o=[];return i&&r(i,o),o}function r(e,r){for(var i=0;i<e.length;i++){var o=e[i];if(o){if(o.line<=0){window.console&&window.console.warn("Cannot display JSHint error (invalid line "+o.line+")",o);continue}var a=o.character-1,t=a+1;if(o.evidence){var s=o.evidence.substring(a).search(/.\b/);s>-1&&(t+=s)}var c={message:o.reason,severity:o.code&&o.code.startsWith("W")?"warning":"error",from:n.Pos(o.line-1,a),to:n.Pos(o.line-1,t)};r.push(c)}}}n.registerHelper("lint","javascript",e)}(r(4631))}}]);