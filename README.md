# Rightjs Growl widget

Rightjs-Growl is a plugin that mimics Mac OS Growl notification system. It is based on [jquery-purr](http://code.google.com/p/jquery-purr/) and was created using the [Right javascript framework](http://rightjs.org).

## Usage

You can create a Growl in two ways:

### Simple message

Simple text growls can be created like this:
    new Growl('My Growl message');
  
### HTML message

In case you need extra markup (so that you can set additional styles), you can do it this way:

    new Growl($E('div').html('<h3>My Growl header</h3><p>My Growl message</p>'));

Or this way:

    $E('div').html('<h3>My Growl header</h3><p>My Growl message</p>').growl();
    
The $E function is a RightJS utility that creates an html element.

### Options

Options should be passed like this: 

    new Growl('My message', {option: value}));
    $E('div').html('My message').growl({option: value});

The following options are available:

  - duration: the duration of the fade in/out animations (in miliseconds, default is 500)
  - timer: the time in that a non-sticky Growl will disappear (in miliseconds, default is 4000)
  - sticky: if this is a sticky Growl, it will not automatically disappear (default is false)

## Demo

A demo is available on my website: http://www.kreusch.com.br/demos/rightjs-growl/index.html
