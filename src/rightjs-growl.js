/**
 * Inline editor feature for RightJS
 *  http://rightjs.org/ui/in-edit
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var Growl = RightJS.Growl = (function(document, RightJS) {
  /**
   * This module defines the basic widgets constructor
   * it creates an abstract proxy with the common functionality
   * which then we reuse and override in the actual widgets
   *
   * Copyright (C) 2010 Nikolay Nemshilov
   */

  /**
   * In-Edit plugin initalization
   *
   * Copyright (C) 2010 Nikolay Nemshilov
   */
  var R = RightJS,
      $ = RightJS.$,
      $w = RightJS.$w,
      Object  = RightJS.Object,
      Element = RightJS.Element;
  
  /**
   * The widget units constructor
   *
   * @param String tag-name or Object methods
   * @param Object methods
   * @return Widget wrapper
   */
  function Widget(tag_name, methods) {
    if (!methods) {
      methods = tag_name;
      tag_name = 'DIV';
    }

    /**
     * An Abstract Widget Unit
     *
     * Copyright (C) 2010 Nikolay Nemshilov
     */
    var AbstractWidget = new RightJS.Wrapper(RightJS.Element.Wrappers[tag_name] || RightJS.Element, {
      /**
       * The common constructor
       *
       * @param Object options
       * @param String optional tag name
       * @return void
       */
      initialize: function(key, options) {
        this.key = key;
        var args = [{'class': 'rui-' + key}];

        // those two have different constructors
        if (!(this instanceof RightJS.Input || this instanceof RightJS.Form)) {
          args.unshift(tag_name);
        }
        this.$super.apply(this, args);

        if (RightJS.isString(options)) {
          options = RightJS.$(options);
        }

        // if the options is another element then
        // try to dynamically rewrap it with our widget
        if (options instanceof RightJS.Element) {
          this._ = options._;
          if ('$listeners' in options) {
            options.$listeners = options.$listeners;
          }
          options = {};
        }
        this.setOptions(options, this);
        return this;
      },

    // protected

      /**
       * Catches the options
       *
       * @param Object user-options
       * @param Element element with contextual options
       * @return void
       */
      setOptions: function(options, element) {
        element = element || this;
        RightJS.Options.setOptions.call(this,
          RightJS.Object.merge(options, eval("("+(
            element.get('data-'+ this.key) || '{}'
          )+")"))
        );
        return this;
      }
    });

    /**
     * Creating the actual widget class
     *
     */
    var Klass = new RightJS.Wrapper(AbstractWidget, methods);

    // creating the widget related shortcuts
    RightJS.Observer.createShortcuts(Klass.prototype, Klass.EVENTS || []);

    return Klass;
  }

  /**
   * The growl instance controller
   *
   * Copyright (C) 2009-2010 Nikolay Nemshilov
   */
  var Growl = new Widget('DIV', {
    extend: {
      version: '0.1',

      Options: {
        duration: 500,
        removeTimer: 4000,
        isSticky: false
      },

      i18n: {
        Close: 'Close'
      }
    },

    /**
     * Constructor
     *
     * @param mixed an element reference
     * @param Object options
     * @return void
     */
    initialize: function(content, options) {
      this.$super('growl', options);
      
      //sets up the growl
      this.content = isElement(content) ? $(content) : $E('div', {class: 'growl'}).html(content).onClick(); 
      if(!this.options.isSticky) {
        this.content.addClass('not-sticky'); 
      }

      //sets up the close button
      this.close = $E('a', {class: 'close', 'href': '#close'}).html(Growl.i18n.Close).insertTo(this.content);

      this.insert(this.content);

      //sets up events
      this.onClick(this._clicked)

      //sets up the growl container
      if(!Growl.container) {
        Growl.container = $E('div', {id: 'growl-container'}).insertTo(document.body);
      }

      this._appear();
    },

   /**
    * Shows the growl
    *
    * @return Growl this
    */
    _appear: function(){
      return this.setStyle({opacity: 0}).insertTo(Growl.container).morph({opacity: 1}, {duration: this.options.duration});
    },

    /**
     * Hides and removes the growl
     *
     * @return Growl this
     */
    _disappear: function(){
      return this.visible() ?
        //hides the growl
        this.morph({opacity: 0}, {
          duration: this.options.duration,
          onFinish: function(){
            //morphs the growl so that the growl under it goes up smoothly
            this.element.morph({height: '0'}, {
              duration: this.element.options.duration,
              onFinish: function(){this.element.remove();}
            });
          }
        })
        : this;
    },

    //protected

    //handles the close event
    _clicked: function(e) {
      var target = e.target;
      if(target == this.close) {
        this._disappear();
      }
    }
  });

  /**
   * The element level growl extension
   *
   * Copyright (C) 2009-2010 Nikolay Nemshilov
   */
  Element.include({
    /**
     * Triggers a growl feature on the element
     *
     * @param Object options for the Growl class
     * @return Growl object
     */
    growl: function(options) {
      return new Growl(this, options);
    }
  });

  document.write("<style type=\"text/css\">#growl-container{position:fixed;top:0;right:0;}</style>");

  return Growl;
})(document, RightJS);
