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

      //EVENTS: $w('show hide send update'),

      Options: {
        fadeInSpeed: 500,
        fadeOutSpeed: 500,
        removeTimer: 4000,
        isSticky: false,
        usingTransparentPNG: false
      },
    },

    /**
     * Constructor
     *
     * @param mixed an element reference
     * @param Object options
     * @return void
     */
    initialize: function(element, options) {
      if(isElement(element)) {
        this.element = $(element);
      } else {
        this.element = $E('div', {class: 'notice'}).html(element); 
      }
      console.log(this.element);

      this
        .$super('growl', options);

      if(!this.options.isSticky) {
        this.element.addClass('not-sticky'); 
      }

      this.container = $('growl-container');
      if(!this.container) {
        this.container = $E('div', {id: 'growl-container'});
        this.container.insertTo(document.body);
      }
      /*
        .insert([
          this.field   = new Input({type: this.options.type, name: this.options.name, 'class': 'field'}),
          this.spinner = new Spinner(4),
          this.submit  = new Input({type: 'submit', 'class': 'submit', value: InEdit.i18n.Save}),
          this.cancel  = new Element('a', {'class': 'cancel', href: '#', html: InEdit.i18n.Cancel})
        ])
        .onClick(this.clicked)
        */
    },

   /**
   * Shows the growl
   *
   * @return Growl this
   */
    show: function(){
      this.element.insertTo(this.container);
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
      return new Growl(this, options).show();
    }
  });

  document.write("<style type=\"text/css\">#growl-container{position:fixed;top:0;right:0;}</style>");

  return Growl;
})(document, RightJS);