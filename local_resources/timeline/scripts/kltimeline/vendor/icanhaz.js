/*!
ICanHaz.js version 0.10 -- by @HenrikJoreteg
More info at: http://icanhazjs.com
ICanHaz.js -- by @HenrikJoreteg
*/

(function (exports) {
    function trim(stuff) {
        if (''.trim) return stuff.trim();
        else return stuff.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    var ich = {
        VERSION: "0.10",
        templates: {},
        
        // grab jquery or zepto if it's there
        $: (typeof window !== 'undefined') ? window.jQuery || window.Zepto || null : null,
        
        // public function for adding templates
        // can take a name and template string arguments
        // or can take an object with name/template pairs
        // We're enforcing uniqueness to avoid accidental template overwrites.
        // If you want a different template, it should have a different name.
        addTemplate: function (name, templateString) {
            if (typeof name === 'object') {
                for (var template in name) {
                    this.addTemplate(template, name[template]);
                }
                return;
            }
            if (ich[name] && window.console && ich.shouldLog) {
                console.error("Invalid name: " + name + "."); 
            } else if (ich.templates[name] && window.console && ich.shouldLog) {
                console.error("Template \"" + name + "  \" exists");
            } else {
                ich.templates[name] = templateString;
                ich[name] = function (data, raw) {
                    data = data || {};
                    var result = Mustache.to_html(ich.templates[name], data, ich.templates);
                    return (ich.$ && !raw) ? ich.$(result) : result;
                };
            }
        },

        // Do we want to see those console.logs?
        setLogging: function(shouldLog){
          ich.shouldLog = shouldLog;
        },

        // Maybe we don't want to process the template at the same time we retrieve it
        getTemplate: function(name) {
          return ich.templates[name];
        },

        // clears all retrieval functions and empties cache
        clearAll: function () {
            for (var key in ich.templates) {
                delete ich[key];
            }
            ich.templates = {};
        },
        
        // clears/grabs
        refresh: function () {
            ich.clearAll();
            ich.grabTemplates();
        },
        
        // grabs templates from the DOM and caches them.
        // Loop through and add templates.
        // Whitespace at beginning and end of all templates inside <script> tags will 
        // be trimmed. If you want whitespace around a partial, add it in the parent, 
        // not the partial. Or do it explicitly using <br/> or &nbsp;
        grabTemplates: function () {        
            var i, 
                scripts = document.getElementsByTagName('script'), 
                script,
                trash = [];
            for (i = 0, l = scripts.length; i < l; i++) {
                script = scripts[i];
                if (script && script.innerHTML && script.id && (script.type === "text/html" || script.type === "text/x-icanhaz")) {
                    ich.addTemplate(script.id, trim(script.innerHTML));
                    trash.unshift(script);
                }
            }
            for (i = 0, l = trash.length; i < l; i++) {
                trash[i].parentNode.removeChild(trash[i]);
            }
        }
    };
   
    if (typeof document !== 'undefined') {
        // Just grab the templates now in case we've missed the DOMContentLoaded 
        ich.grabTemplates();
        /*
        if (ich.$) {
            ich.$(function () {
                ich.grabTemplates();
            });
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                ich.grabTemplates();
            }, true);
        }
        */
    }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return ich;
    });
  }

  exports.ich = ich;

})(this);
