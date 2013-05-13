/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/**
 * Terrific JavaScript Framework v2.0.1
 * http://terrifically.org
 *
 * Copyright 2012, Remo Brunschwiler
 * MIT Licensed.
 *
 * Date: Mon, 10 Sep 2012 13:44:44 GMT
 *
 *
 * Includes:
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 *
 * @module Tc
 *
 */
var Tc = Tc || {};

/*
 * The base library object.
 */
Tc.$ = $;

/*
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
(function(){
    var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
    
    // The base Class implementation (does nothing)
    this.Class = function(){
    };
    
    // Create a new Class that inherits from this class
    Class.extend = function(prop){
        var _super = this.prototype;
        
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;
        
        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" &&
            fnTest.test(prop[name]) ? (function(name, fn){
                return function(){
                    var tmp = this._super;
                    
                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];
                    
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    
                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }
        
        // The dummy class constructor
        function Class(){
            // All construction is actually done in the init method
            if (!initializing && this.init) {
				this.init.apply(this, arguments);
			}
        }
        
        // Populate our constructed prototype object
        Class.prototype = prototype;
        
        // Enforce the constructor to be what we expect
        Class.constructor = Class;
        
        // And make this class extendable
        Class.extend = arguments.callee;
        
        return Class;
    };
})();

/**
 * Contains the application base config.
 * The base config can be extended or overwritten either via
 * new Application ($ctx, config) during bootstrapping the application or via
 * overriding the Tc.Config object in your project.
 *
 * @author Remo Brunschwiler
 * @namespace Tc
 * @class Config
 * @static
 */
Tc.Config = {
    /** 
     * The paths for the different types of dependencies.
     *
     * @property dependencies
     * @type Object
     */
    dependencies: {
        css: '/css/dependencies',
        js: '/js/dependencies'
    }
};

(function($) {
    "use strict";

    /**
     * Responsible for application-wide issues such as the creation of modules and establishing connections between them.
     *
     * @author Remo Brunschwiler
     * @namespace Tc
     * @class Application
     */
    Tc.Application = Class.extend({

        /**
         * Initializes the application.
         *
         * @method init
         * @constructor
         * @param {jQuery} $ctx
         *      The jQuery context
         * @param {Object} config
         *      The configuration
         */
        init: function($ctx, config) {
            /**
             * The configuration.
             *
             * @property config
             * @type Object
             */
            this.config = $.extend(Tc.Config, config);

            /**
             * The jQuery context.
             *
             * @property $ctx
             * @type jQuery
             */
            this.$ctx = $ctx || $('body');

            /**
             * Contains references to all modules on the page. This can, for
             * example, be useful when there are interactions between Flash
             * objects and Javascript.
             *
             * @property modules
             * @type Array
             */
            this.modules = [];

            /**
             * Contains references to all connectors on the page.
             *
             * @property connectors
             * @type Object
             */
            this.connectors = {};

            /**
             * The sandbox to get the resources from
             * This sandbox is shared between all modules.
             *
             * @property sandbox
             * @type Sandbox
             */
            this.sandbox = new Tc.Sandbox(this, this.config);
        },

        /**
         * Register modules withing scope
         * Automatically registers all modules within the scope,
         * as long as the modules use the OOCSS naming conventions.
         *
         * @method registerModules
         * @param {jQuery} $ctx
         *      The jQuery context
         * @return {Array}
         *      A list containing the references of the registered modules
         */
        registerModules : function($ctx) {
            var self = this,
                modules = [],
                stringUtils = Tc.Utils.String;

            $ctx = $ctx || this.$ctx;

            $ctx.find('.mod:not([data-ignore="true"])').each(function() {
                var $this = $(this),
                    classes = $this.attr('class').split(' ');

                /*
                 * A module can have several different classes and data attributes.
                 * See below for possible values.
                 */

                /*
                 * @config .mod
                 *
                 * Indicates that it is a base module, this is the default and
                 * no JavaScript needs to be involved. It must occur excactly
                 * once.
                 */

                /*
                 * @config .mod{moduleName} || .mod-{module-name}
                 *
                 * Indicates that it is a module of type basic, which is
                 * derived from the base module. It can occur at most
                 * once. Example: .modBasic || .mod-basic
                 */

                /*
                 * @config .skin{moduleName}{skinName} || .skin-{module-name}-{skin-name}
                 *
                 * Indicates that the module basic has the submarine skin. It
                 * will be decorated by the skin JS (if it exists). It can occur
                 * arbitrarily. Example: .skinBasicSubmarine || .skin-basic-submarine
                 */

                /*
                 * @config data-connectors
                 *
                 * A module can have a comma-separated list of data connectors.
                 * The list contains the IDs of the connectors in the following
                 * schema: {connectorType}-{connectorId}
                 *
                 * {connectorType} is optional. If only the {connectorId} is given, the
                 * default connector is instantiated.
                 *
                 * The example MasterSlave-Navigation decodes to: type =
                 * MasterSlave, id = Navigation. This instantiates the MasterSlave
                 * connector (as mediator) with the connector id Navigation.
                 * The connector id is used to chain the appropriate (the ones with the same id)
                 * modules together and to improve the reusability of the connector.
                 * It can contain multiple connector ids (e.g. 1,2,MasterSlave-Navigation).
                 */

                if (classes.length > 1) {
                    var modName,
                        skins = [],
                        connectors = [],
                        dataConnectors;

                    for (var i = 0, len = classes.length; i < len; i++) {
                        var part = $.trim(classes[i]);

                        // do nothing for empty parts
                        if(part) {
                            // convert to camel if necessary
                            if (part.indexOf('-') > -1) {
                                part = stringUtils.toCamel(part);
                            }

                            if (part.indexOf('mod') === 0 && part.length > 3) {
                                modName = part.substr(3);
                            }
                            else if (part.indexOf('skin') === 0) {
                                // Remove the mod name part from the skin name
                                skins.push(part.substr(4).replace(modName, ''));
                            }
                        }
                    }

                    /*
                     * This needs to be done via attr() instead of data().
                     * As data() cast a single number-only connector to an integer, the split will fail.
                     */
                    dataConnectors = $this.attr('data-connectors');

                    if (dataConnectors) {
                        connectors = dataConnectors.split(',');
                        for (var i = 0, len = connectors.length; i < len; i++) {
                            var connector = $.trim(connectors[i]);
                            // do nothing for empty connectors
                            if(connector) {
                                connectors[i] = connector;
                            }
                        }
                    }

                    if (modName && Tc.Module[modName]) {
                        modules.push(self.registerModule($this, modName, skins, connectors));
                    }
                }
            });

            return modules;
        },

        /**
         * Unregisters the modules given by the module instances.
         *
         * @method unregisterModule
         * @param {Array} modules
         *      A list containting the module instances to unregister
         */
        unregisterModules : function(modules) {
            var connectors = this.connectors;

            modules = modules || this.modules;

            if (modules === this.modules) {
                // Clear everything if the arrays are equal
                this.connectors = [];
                this.modules = [];
            }
            else {
                // Unregister the given modules
                for (var i = 0, len = modules.length; i < len; i++) {
                    var module = modules[i],
                        index;

                    // Delete the references in the connectors
                    for (var connectorId in connectors) {
                        if (connectors.hasOwnProperty(connectorId)) {
                            connectors[connectorId].unregisterComponent(module);
                        }
                    }

                    // Delete the module instance itself
                    index = $.inArray(module, this.modules);
                    if(index > -1) {
                        delete this.modules[index];
                    }
                }
            }
        },

        /**
         * Starts (intializes) the registered modules.
         *
         * @method start
         * @param {Array} modules
         *      A list of the modules to start
         */
        start: function(modules) {
            modules = modules || this.modules;

            // Start the modules
            for (var i = 0, len = modules.length; i < len; i++) {
                modules[i].start();
            }
        },

        /**
         * Stops the registered modules.
         *
         * @method stop
         * @param {Array} modules
         *      A list containting the module instances to stop
         */
        stop: function(modules) {
            modules = modules || this.modules;

            // Stop the modules
            for (var i = 0, len = modules.length; i < len; i++) {
                modules[i].stop();
            }
        },

        /**
         * Registers a module.
         *
         * @method registerModule
         * @param {jQuery} $node
         *      The module node
         * @param {String} modName
         *      The module name. It must match the class name of the module
         * @param {Array} skins
         *      A list of skin names. Each entry must match a class name of a skin
         * @param {Array} connectors
         *      A list of connectors identifiers (e.g. MasterSlave-Navigation)
         *      Schema: {connectorName}-{connectorId}
         * @return {Module}
         *      The reference to the registered module
         */
        registerModule : function($node, modName, skins, connectors) {
            var modules = this.modules;

            modName = modName || undefined;
            skins = skins || [];
            connectors = connectors || [];

            if (modName && Tc.Module[modName]) {
                // Generate a unique ID for every module
                var id = modules.length;
                $node.data('id', id);

                // Instantiate module
                modules[id] = new Tc.Module[modName]($node, this.sandbox, id);

                // Decorate it
                for (var i = 0, len = skins.length; i < len; i++) {
                    var skinName = skins[i];

                    if (Tc.Module[modName][skinName]) {
                        modules[id] = modules[id].getDecoratedModule(modName, skinName);
                    }
                }

                // Register connections
                for (var i = 0, len = connectors.length; i < len; i++) {
                    this.registerConnection(connectors[i], modules[id]);
                }

                return modules[id];
            }

            return null;
        },

        /**
         * Registers a connection between a module and a connector.
         *
         * @method registerConnection
         * @param {String} connector
         *      The full connector name (e.g. MasterSlave-Navigation)
         * @param {Module} component
         *      The module instance
         */
        registerConnection : function(connector, component) {
            connector = $.trim(connector);

            var parts = connector.split('-'),
                connectorType,
                connectorId,
                identifier;

            if(parts.length === 1) {
                // default connector
                identifier = connectorId = parts[0];
            }
            else if(parts.length === 2) {
                // a specific connector type is given
                connectorType = parts[0];
                connectorId = parts[1];
                identifier = connectorType + connectorId;
            }

            if(identifier) {
                var connectors = this.connectors;

                if (!connectors[identifier]) {
                    // Instantiate the appropriate connector if it does not exist yet
                    if (!connectorType) {
                        connectors[identifier] = new Tc.Connector(connectorId);
                    }
                    else if (Tc.Connector[connectorType]) {
                        connectors[identifier] = new Tc.Connector[connectorType](connectorId);
                    }
                }

                if (connectors[identifier]) {
                    /*
                     * The connector observes the component and attaches it as
                     * an observer.
                     */
                    component.attachConnector(connectors[identifier]);

                    /*
                     * The component wants to be informed over state changes.
                     * It registers it as connector member.
                     */
                    connectors[identifier].registerComponent(component);
                }
            }
        },

        /**
         * Unregisters a module from a connector.
         *
         * @method unregisterConnection
         * @param {String} connectorId
         *      The connector channel id (e.g. 2)
         * @param {Module} component
         *      The module instance
         */
        unregisterConnection : function(connectorId, component) {
            var connector =  this.connectors[connectorId];

            // Delete the references in the connector and the module
            if (connector) {
                connector.unregisterComponent(component);
                component.detachConnector(connector);
            }
        }
    });
})(Tc.$);

(function($) {
    "use strict";

    /**
     * The sandbox is used as a central point to get resources from, grant
     * permissions, etc.  It is shared between all modules.
     *
     * @author Remo Brunschwiler
     * @namespace Tc
     * @class Sandbox
     */
    Tc.Sandbox = Class.extend({

        /**
         * Initializes the Sandbox.
         *
         * @method init
         * @constructor
         * @param {Applicaton} application 
         *      The application reference
         * @param {Object} config 
         *      The configuration
         */
        init : function(application, config) {

            /**
             * The application
             *
             * @property application
             * @type Application
             */
            this.application = application;

            /**
             * The configuration.
             *
             * @property config
             * @type Object
             */
            this.config = config;

            /**
             * Contains the 'after' hook module callbacks.
             *
             * @property afterCallbacks
             * @type Array
             */
            this.afterCallbacks = [];
        },

        /**
         * Adds (register and start) all modules in the given context scope.
         *
         * @method addModules
         * @param {jQuery} $ctx 
         *      The jQuery context
         * @return {Array} 
         *      A list containing the references of the registered modules
         */
        addModules: function($ctx) {
            var modules = [],
                application = this.application;

            if ($ctx) {
                // Register modules
                modules = application.registerModules($ctx);

                // Start modules
                application.start(modules);
            }

            return modules;
        },

        /**
         * Removes a module by module instances.
         * This stops and unregisters a module through a module instance.
         *
         * @method removeModules
         * @param {Array} modules 
         *      A list containting the module instances to remove
         */
        removeModules: function(modules) {
            var application = this.application;

            if (modules) {
                // Stop modules
                application.stop(modules);

                // Unregister modules
                application.unregisterModules(modules);
            }
        },

        /**
         * Subscribes a module to a connector.
         *
         * @method subscribe
         * @param {String} connector The full connector name (e.g. MasterSlave-Navigation)
         * @param {Module} module The module instance
         */
        subscribe: function(connector, module) {
            var application = this.application;

            if(module instanceof Tc.Module && connector) {
                // explicitly cast connector to string
                connector = connector + '';
                application.registerConnection(connector, module);
            }
        },

        /**
         * Unsubscribes a module from a connector.
         *
         * @method unsubscribe
         * @param {String} connectorId The connector channel id (e.g. 2 or Navigation)
         * @param {Module} module The module instance
         */
        unsubscribe: function(connectorId, module) {
            var application = this.application;

            if(module instanceof Tc.Module && connectorId) {
                // explicitly cast connector id to string
                connectorId = connectorId + '';
                application.unregisterConnection(connectorId, module);
            }
        },

        /**
         * Gets the appropriate module for the given ID.
         *
         * @method getModuleById
         * @param {int} id 
         *      The module ID
         * @return {Module} 
         *      The appropriate module
         */
        getModuleById: function(id) {
            var application = this.application;

            if (application.modules[id] !== undefined) {
                return application.modules[id];
            }
            else {
                throw new Error('the module with the id ' + id + 
                                ' does not exist');
            }
        },

        /**
         * Gets the application config.
         *
         * @method getConfig
         * @return {Object} 
         *      The configuration object
         */
        getConfig: function() {
            return this.config;
        },

        /**
         * Gets an application config param.
         *
         * @method getConfigParam
         * @param {String} name 
         *      The param name
         * @return {mixed} 
         *      The appropriate configuration param
         */
        getConfigParam: function(name) {
            var config = this.config;

            if (config[name] !== undefined) {
                return config[name];
            }
            else {
                throw new Error('the config param ' + name + ' does not exist');
            }
        },

        /**
         * Collects the module status messages and handles the callbacks.
         * This means that it is ready for the 'after' hook.
         *
         * @method ready
         * @param {Function} callback 
         *      The 'after' hook module callback
         */
        ready: function(callback) {
            var afterCallbacks = this.afterCallbacks;

            // Add the callback to the stack
            afterCallbacks.push(callback);

            // Check whether all modules are ready for the 'after' hook
            if (this.application.modules.length === afterCallbacks.length) {
                for (var i = 0; i < afterCallbacks.length; i++) {
                    var afterCallback = afterCallbacks[i];

                    if(typeof afterCallback === "function") {
                        // make sure the callback is only executed once (and is not called during addModules)
                        delete afterCallbacks[i];
                        afterCallback();
                    }
                }
            }
        }
    });
})(Tc.$);

(function($) {
    "use strict";

    /**
     * Base class for the different modules.
     *
     * @author Remo Brunschwiler
     * @namespace Tc
     * @class Module
     */
    Tc.Module = Class.extend({

        /**
         * Initializes the Module.
         *
         * @method init
         * @constructor
         * @param {jQuery} $ctx
         *      The jQuery context
         * @param {Sandbox} sandbox
         *      The sandbox to get the resources from
         * @param {String} id
         *      The Unique module ID
         */
        init: function($ctx, sandbox, id) {
            /**
             * Contains the module context.
             *
             * @property $ctx
             * @type jQuery
             */
            this.$ctx = $ctx;

            /**
             * Contains the unique module ID.
             *
             * @property id
             * @type String
             */
            this.id = id;

            /**
             * Contains the attached connectors.
             *
             * @property connectors
             * @type Object
             */
            this.connectors = {};

            /**
             * The sandbox to get the resources from.
             *
             * @property sandbox
             * @type Sandbox
             */
            this.sandbox = sandbox;
        },

        /**
         * Template method to start (i.e. init) the module.
         * This method provides hook functions which can be overridden
         * by the individual instance.
         *
         * @method start
         */
        start: function() {
            var self = this;

            // Call the hook method from the individual instance and provide the appropriate callback
            if (this.on) {
                this.on(function() {
                    self.initAfter();
                });
            }
        },

        /**
         * Template method to stop the module.
         *
         * @method stop
         */
        stop: function() {
            var $ctx = this.$ctx;

            // Remove all bound events and associated jQuery data
            $('*', $ctx).unbind().removeData();
            $ctx.unbind().removeData();
        },


        /**
         * Initialization callback.
         *
         * @method initAfter
         * @protected
         */
        initAfter: function() {
            var self = this;

            this.sandbox.ready(function() {
                /*
                 * Call the 'after' hook method from the individual instance
                 */
                if (self.after) {
                    self.after();
                }
            });
        },

        /**
         * Notifies all attached connectors about changes.
         *
         * @method fire
         * @param {String} state The new state
         * @param {Object} data The data to provide to your connected modules (optional)
         * @param {Array} channels  A list containting the channel ids to send the event to (optional)
         * @param {Function} defaultAction The default action to perform (optinal)
         */
        fire: function(state, data, channels, defaultAction) {
            var self = this,
                connectors = this.connectors,
                shouldBeCalled = true;  // indicates whether the default handler should be called

            // validate params
            if(channels == null && defaultAction == null) {
                // Max. 2 params
                if (typeof data === 'function') {
                    // (state, defaultAction)
                    defaultAction = data;
                    data = undefined;
                }
                else if ($.isArray(data)) {
                    // (state, channels)
                    channels = data;
                    data = undefined;
                }
            }
            else if(defaultAction == null) {
                // 2-3 params
                if (typeof channels === 'function') {
                    // (state, data, defaultAction)
                    defaultAction = channels;
                    channels = undefined;
                }

                if ($.isArray(data)) {
                    // (state, channels, defaultAction)
                    channels = data;
                    data = undefined;
                }
            }

            state = Tc.Utils.String.capitalize(state);
            data = data || {};
            channels = channels || Object.keys(connectors);

            for (var i = 0, len = channels.length; i < len; i++) {
                var connectorId = channels[i];
                if(connectors.hasOwnProperty(connectorId)) {
                    var connector = connectors[connectorId],
                        proceed = connector.notify(self, 'on' + state, data) || false;

                    if (!proceed) {
                        shouldBeCalled = false;
                    }

                } else {
                    throw new Error('the module #' + self.id + ' is not connected to connector ' + connectorId);
                }
            }

            // Execute default action unless a veto is provided
            if (shouldBeCalled) {
                if (typeof defaultAction === 'function') {
                    defaultAction();
                }
            }
        },

        /**
         * Attaches a connector (observer).
         *
         * @method attachConnector
         * @param {Connector} connector
         *      The connector to attach
         */
        attachConnector: function(connector) {
            this.connectors[connector.connectorId] = connector;
        },

        /**
         * Detaches a connector (observer).
         *
         * @method detachConnector
         * @param {Connector} connector The connector to detach
         */
        detachConnector: function(connector) {
            delete this.connectors[connector.connectorId];
        },

        /**
         * Decorates itself with the given skin.
         *
         * @method getDecoratedModule
         * @param {String} module The name of the module
         * @param {String} skin The name of the skin
         * @return {Module} The decorated module
         */
        getDecoratedModule: function(module, skin) {
            if (Tc.Module[module][skin]) {
                var Decorator = Tc.Module[module][skin];

                /*
                 * Sets the prototype object to the module.
                 * So the "non-decorated" functions will be called on the module
                 * without implementing the whole module interface.
                 */
                Decorator.prototype = this;
                Decorator.prototype.constructor = Tc.Module[module][skin];

                return new Decorator(this);
            }

            return null;
        }
    });
})(Tc.$);

(function($) {
    "use strict";

    /**
     * Base class for the different connectors.
     *
     * @author Remo Brunschwiler
     * @namespace Tc
     * @class Connector
     */
    Tc.Connector = Class.extend({

        /**
         * Initializes the Connector.
         *
         * @method init
         * @constructor
         * @param {String} connectorId
         *      The unique connector ID
         */
        init : function(connectorId) {
            this.connectorId = connectorId;
            this.components = {};
        },

        /**
         * Registers a component.
         *
         * @method registerComponent
         * @param {Module} component 
         *      The module to register
         */
        registerComponent: function(component) {
            this.components[component.id] = {
                'component': component
            };
        },

        /**
         * Unregisters a component.
         *
         * @method unregisterComponent
         * @param {Module} component 
         *      The module to unregister
         */
        unregisterComponent: function(component) {
            var components = this.components;

            if(components[component.id]) {
                delete components[component.id];
            }
        },

        /**
         * Notifies all registered components about a state change 
         * This can be be overriden in the specific connectors.
         *
         * @method notify
         * @param {Module} origin
         *      The module that sends the state change
         * @param {String} state 
         *      The component's state
         * @param {Object} data 
         *      Contains the state relevant data (if any)
         * @return {boolean}
         *      Indicates whether the default action should be excuted or not
         */
        notify: function(origin, state, data, callback) {
            /*
             * Gives the components the ability to prevent the default- and
             * after action from the events by returning false in the
             * on {Event}-Handler.
             */
            var proceed = true,
                components = this.components;

            for (var id in components) {
                if(components.hasOwnProperty(id)) {
                    var component = components[id].component;
                    if (component !== origin && component[state]) {
                        if (component[state](data) === false) {
                            proceed = false;
                        }
                    }
                }
            }

            return proceed;
        }
    });
})(Tc.$);

/*
 * Contains utility functions for several tasks.
 */
Tc.Utils = {};

// Helper
if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [], k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}
/**
 * Contains utility functions for string concerning tasks.
 *
 * @author Remo Brunschwiler
 * @namespace Tc
 * @class Utils.String
 * @static
 */
(function($) {
    "use strict";

    Tc.Utils.String = {
        /**
         * Capitalizes the first letter of the given string.
         *
         * @method capitalize
         * @param {String} str 
         *      The original string
         * @return {String} 
         *      The capitalized string
         */
        capitalize: function(str) {
            // Capitalize the first letter
            return str.substr(0, 1).toUpperCase().concat(str.substr(1));
        },

        /**
         * Camelizes the given string.
         *
         * @method toCamel
         * @param {String} str 
         *      The original string
         * @return {String} 
         *      The camelized string
         */
        toCamel: function(str){
            return str.replace(/(\-[A-Za-z])/g, function($1){return $1.toUpperCase().replace('-','');});
        }
    };
})(Tc.$);


(function($) {
	/**
	 * BootstrapCarousel module implementation.
	 *
	 * @author
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.BootstrapCarousel = Tc.Module.extend({

		/**
		 * Initializes the BootstrapCarousel module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {

			//log('Module BootstrapCarousel has unmet dependencies');
			// bootstrap-carousel.css
			// bootstrap-carousel.js
			$('.carousel').carousel({interval: false});

			callback();
			this.$ctx.append('\n<br><span class="debug">mod BootstrapCarousel started</span>');
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {
		}
	});
})(Tc.$);
(function($) {
	/**
	 * Example module implementation.
	 *
	 * @author 
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.Example = Tc.Module.extend({

		/**
		 * Initializes the Example module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {
			this.$ctx.append('\n<br><span class="debug">JS Module &quot;example&quot; started</span>');
			callback();
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {
			console.log('module example after()')
		}
	});
})(Tc.$);
(function($) {
	/**
	 * Foo module implementation.
	 *
	 * @author Foo B. Baz
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.Foo = Tc.Module.extend({

		/**
		 * Initializes the Foo module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {
			this.$ctx.append('\n<br><span>mod foo started</span>');
			callback();
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {
		}
	});
})(Tc.$);
(function($) {
	/**
	 * Basic Skin implementation for the Example module.
	 *
	 * @author 
	 * @namespace Tc.Module.Default
	 * @class Basic
	 * @extends Tc.Module
	 * @constructor
	 */
	Tc.Module.Example.Alternate = function(parent) {
		/**
		 * override the appropriate methods from the decorated module (ie. this.get = function()).
		 * the former/original method may be called via parent.<method>()
		 */
		this.on = function(callback) {
			// calling parent method
			parent.on(callback);
			parent.$ctx.append('\n<br><span>JS skin &quot;Example.Alternate&quot; started</span>');
		};

		this.after = function() {
			// calling parent method
			parent.after();
		};
	};
})(Tc.$);

(function($) {
	/**
	 * Basic Skin implementation for the Foo module.
	 *
	 * @author Foo B. Baz
	 * @namespace Tc.Module.Default
	 * @class Basic
	 * @extends Tc.Module
	 * @constructor
	 */
	Tc.Module.Foo.Alternate = function(parent) {
		/**
		 * override the appropriate methods from the decorated module (ie. this.get = function()).
		 * the former/original method may be called via parent.<method>()
		 */
		this.on = function(callback) {
			// calling parent method
			parent.on(callback);
			parent.$ctx.append('\n<br><span>skin foo alternate started</span>');
		};

		this.after = function() {
			// calling parent method
			parent.after();
		};
	};
})(Tc.$);


// WP7 can't be detected with conditional comments.
(navigator.userAgent.indexOf('Windows Phone') != -1 || navigator.userAgent.indexOf('WP7') != -1) && (document.documentElement.className += ' wp7');
$(document.documentElement).removeClass('no-js');

/**
 * Terrific Bootstrapping
 */
(function (window, Tc, document) {
	$(document).ready(function () {
		var app
			,$ = Tc.$
			,$body = $(document.documentElement)
			,config = {
				dependencyPath: {
					library: window.assetsUrl + '/scripts/libs-dyn/',
					plugin:  window.assetsUrl + '/scripts/plugins-dyn/',
					util:    window.assetsUrl + '/scripts/utils-dyn/'
				}
			},
			moduleTest
		;

		// custom function for context selection
		Tc.Module.prototype.$$ = function $$(selector) {
			return this.$ctx.find(selector);
		};

		app = window.application = new Tc.Application($body, config);
		app.registerModules();
		ModuleTest && (moduleTest = new ModuleTest(app)); // Prepare atomic module tests
		//app.registerModule($body, 'Layout');
		app.start();
		moduleTest && moduleTest.run();
	});
})(window, Tc, document);