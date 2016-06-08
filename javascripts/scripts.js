var App = {
    init: function() {
        
        
        // Bubble widget
        $('[data-bubble]').bubble();
        
        // Dropdown widget
        $('[data-dropdown]').dropdown();
        
        
        // Clean radio buttons and checboxes cached values
        $('input[type=radio], input[type=checkbox]').each(function(i, el) {
            $(el).prop('checked', $(el).attr('checked') === 'checked' ? true : false);
        });
        
        // Support attachment input change
        $('[data-support-attachment]').change(function(e) {
            var $target = $(this),
                value = $target.val(),
                $list = $target.closest('form').find('.attached-file');
            
            if (value.length) {
                $list.find('.item').text(value);
                $list.show();
            } 
        });
        
        // Support attachment clear
        $('[data-support-attachment-clear]').on('click', function(e) {
            e.preventDefault();
            
            var $form = $(e.target).closest('form'),
                $list = $form.find('.attached-file'),
                $input = $form.find('[data-support-attachment]');
                
            if ($input.length) {
                $input.wrap('<form>').closest('form').get(0).reset();
                $input.unwrap();
                $list.hide();
            }
        });
        
        // Support form submit
        $('.support form').submit(function(e) {
            
            e.preventDefault();
            var $support = $(this).closest('.support'),
                $error = $support.find('.support-error'),
                $success = $support.find('.support-success'),
                $attachment = $support.find('input[type=file]'),
                show_error = false;
            
            
            if ($attachment.val() && (!/(\.gif|\.jpg|\.jpeg|\.doc|\.xls)$/i.test($attachment.val()))) {
                show_error = true;
            }
            
            if (show_error) {
                $error.show();
                $error.find('.btn').one('click', function(e) { 
                    e.preventDefault(); 
                    $error.hide(); 
                });
            }
            else {
                
                // Make ajax send here !
                
                $success.show();
                $success.find('.btn').one('click', function(e) { 
                    e.preventDefault(); 
                    $success.hide(); 
                });
            }
        });
        
        // Toggle elements visibility
        $(document).on('click','[data-visibility-toggler]', function(e) {
            e.preventDefault();
            var $parent = $(e.target).closest('[data-visibility-parent]'),
                $elements = $parent.find('[data-visible]'),
                $visible = $elements.filter('[data-visible=true]'),
                $hidden = $elements.filter('[data-visible=false]');
                
            $visible.attr('data-visible','false');
            $hidden.attr('data-visible','true'); 
        });
        
        // Close notifications
        $(document).on('click','.js-notification-close', function(e) {
            e.preventDefault();
            var $notification = $(e.target).closest('.notification');
            
            // remove notification 
            // $notification.remove(); 
            
            // hide with animation 
            $(e.target).closest('.notification').animate({
                'opacity': '0'
            }, 1000, function() {      
                $notification.removeClass('notification-visible').removeAttr('style');
            }); 
        });
        
        
        // Row filter 
        $(document).on('change', '[data-row-filter] input[type=radio]', $.proxy(function(e) {
            var $target = $(e.target),
                $filter = $target.closest('[data-row-filter]'),
                $table = $filter.closest('table'),
                $indicator = $filter.find('[data-row-filter-indicator]'),
                indicator_name = $target.val(),
                attr = $target.attr('data-row-filter-attr'),
                filters_collection = {};
            
            $indicator.text(indicator_name);
            $filter.attr('data-row-filter', attr);
            
            $table.find('thead [data-row-filter]').each(function(i, el) {
                var $el = $(el);
                if ($el.attr('data-row-filter') && $el.attr('data-row-filter') !== '') {
                    filters_collection[$(el).attr('data-row-filter-id')] = $el.attr('data-row-filter');
                }
            });
            
            $table.find('tbody').each(function(i, tbody) {
                var $tbody = $(tbody),
                    row_visible = true;
                    
                _.each(filters_collection, function(attr, id) {
                    var $td = $tbody.find('[data-row-filter-id=' + id +']');
                    
                    if ($td.attr('data-row-filter-attr') !== attr) {
                        row_visible = false;
                    }
                });
                
                $tbody.attr('data-row-filter-visible', row_visible);
            });
        }, this));
        
        
        // Table filter
        $(document).on('change', '[data-filter] input[data-filter-opt]', $.proxy(function(e) {
            var $target = $(e.target),
                $filter = $target.closest('[data-filter]'),
                $parent = $filter.closest('[data-filter-parent]'),
                attr = $target.attr('data-filter-opt'),
                checked = $target.prop('checked'),
                $elements = $parent.find('[data-filter-id='+ attr+']');
            
            $elements.toggle();
            
            if ($parent.children('[data-filter-menu]').length) {
                
                var $td = $elements.first().closest('td'),
                    index = $td.parent().children().index($td),
                    $children = $td.children();
            

                if ($children.filter(function(i,el) { return $(el).css('display') == 'none';  }).length != $children.length) {
                    $parent.find('tr').each(function() {
                         $(this).children().eq(index).show();
                    });
                }
                else {
                    $parent.find('tr').each(function() {
                         $(this).children().eq(index).hide();
                    });
                }
            }
        }, this));
        
        // List filter
        $(document).on('keyup', '[data-list-filter-opt]', $.proxy(function(e) {
            var $target = $(e.target),
                $filter = $target.closest('[data-list-filter]'),
                $items = $filter.find('[data-list-filter-id]'),
                $empty = $filter.find('[data-list-filter-empty]'),
                val = $target.val();
                
            
            $items.each(function(i, el) {
                if ($(el).data('listFilterId').toLowerCase().indexOf(val.toLowerCase()) != -1) {
                    $(el).show();
                    $empty.hide();
                }
                else {
                    $(el).hide();
                }
                
                if(!$items.filter(':visible').length) {
                    $empty.show();
                }
                
            });
        }, this));
    }
};

$(function() {
    App.init();
});


// Bubble plugin
;(function($) {

    var pluginName = 'bubble',
        defaults = {
            vPos : 'bottom',
            hPos : 'right',
            forceDefaultPosition : false,
            disableSideClick : false,
            arrowPos : 40, // arrow position from bubble side in pixels
            arrowSize : 10 // arrow size in pixels
        };

    function Plugin(elem, options) {
        
        this.elem       = elem;
        this.$elem      = $(elem);

        this.options    = $.extend({}, defaults, options);
        this._defaults  = defaults;
        this._name      = pluginName;
        
        this.handleDocumentClick = handleDocumentClick.bind(this);
        
        this.init();
    }
    
    
    var handleDocumentClick = function(e) {
        var target = e.target;
        if ((!$.contains(this.$content.get(0), target) && target !== this.$content.get(0)) || ($.contains(this.$content.get(0), target) && $(target).attr('data-bubble-close') !== undefined)) {
            this.$elem.attr('data-bubble-visible', false);
            this.$content.attr('data-bubble-content-visible', false);
            $(document).off('click', this.handleDocumentClick);
        }
    };
    
    var setHorizontalPosition = function() {
        var posType, left = 0,
            elemWidth = this.$elem.width(),
            bubbleWidth = this.$content.width();
        
        if (this.hPos == 'left') { 
            posType = 1;
            left = -bubbleWidth + elemWidth/2 + this.options.arrowPos + this.options.arrowSize;
        }
        else if (this.hPos == 'right') { 
            posType = 2;
            left = elemWidth/2 - this.options.arrowPos - this.options.arrowSize;
        }
        
        if (posType) {
            this.$content
                .removeClass('bubble-hpos-type-1 bubble-hpos-type-2')
                .addClass('bubble-hpos-type-' + posType)
                .css('left', left + 'px');
        }
    };
    
    var setVerticalPosition = function() {
        
        var posType;
        
        if (this.vPos == 'bottom') { posType = 1; }
        else if (this.vPos == 'top') { posType = 2; }
        
        if (posType) {
            this.$content
                .removeClass('bubble-vpos-type-1 bubble-vpos-type-2')
                .addClass('bubble-vpos-type-' + posType);
        }
    };
    
    var checkPosition = function() {
        
        if (!checkVerticalPosition.bind(this)()) {
            
            this.vPos = (this.vPos == 'bottom') ? 'top' : 'bottom';
            setVerticalPosition.bind(this)();
            
            if (!checkVerticalPosition.bind(this)()) {
                this.vPos = (this.vPos == 'bottom') ? 'top' : 'bottom';
                setVerticalPosition.bind(this)();
            }
        }
        if (!checkHorizontalPosition.bind(this)()) {
            
            this.hPos = (this.hPos == 'left') ? 'right' : 'left';
            setHorizontalPosition.bind(this)();
            
            if (!checkHorizontalPosition.bind(this)()) {
                
                this.hPos = (this.hPos == 'left') ? 'right' : 'left';
                setHorizontalPosition.bind(this)();
            }
        }
    };
    
    var checkVerticalPosition = function() {
        
        var checkNum, viewport;
        
        if (this.vPos == 'bottom') {
            
            if (this.$area === 'viewport') {
                viewport = getViewport();
                checkNum = Math.round(viewport.t + viewport.h);
            }
            else {
                checkNum = Math.round(this.$area.offset().top + this.$area.outerHeight());
            }
            
            if (checkNum < Math.round(this.$content.offset().top + this.$content.outerHeight())) {
                return false;
            }
        }
        else if (this.vPos == 'top') {
            
            if (this.$area === 'viewport') {
                viewport = getViewport();
                checkNum = Math.round(viewport.t);
            }
            else {
                checkNum = Math.round(this.$area.offset().top);
            }
            
            if (checkNum > Math.round(this.$content.offset().top)) {
                return false;
            }
        }
        
        return true;
    };
    
    var checkHorizontalPosition = function() {
        
        var checkNum, viewport;
        
        if (this.hPos == 'right') {
            
            if (this.$area === 'viewport') {
                viewport = getViewport();
                checkNum = Math.round(viewport.l + viewport.w);
            }
            else {
                checkNum = Math.round(this.$area.offset().left + this.$area.outerWidth());
            }
            
            if (checkNum < Math.round(this.$content.offset().left + this.$content.outerWidth())) {
                return false;
            }
        }
        else if (this.hPos == 'left') {
            
            if (this.$area === 'viewport') {
                viewport = getViewport();
                checkNum = Math.round(viewport.l);
            }
            else {
                checkNum = Math.round(this.$area.offset().left);
            }
            if (Math.round(this.$area.offset().left) > Math.round(this.$content.offset().left)) {
                return false;
            }
        }
        
        return true;
    };
    
    var getViewport = function() {
        var $w = $(window);
        return {
            l: $w.scrollLeft(),
            t: $w.scrollTop(),
            w: $w.width(),
            h: $w.height()
        };
    };
    
    Plugin.prototype.setPosition = function() {
        
        this.vPos = this.options.vPos;
        this.hPos = this.options.hPos;
        
        setVerticalPosition.bind(this)();
        setHorizontalPosition.bind(this)();
        
        if (!this.options.forceDefaultPosition) {
            checkPosition.bind(this)();
        }
    };

    Plugin.prototype.init = function() {
        
        this.$toggler = this.$elem.find('[data-bubble-toggler]');
        this.$content = this.$elem.find('[data-bubble-content]');
            
            
         if (this.$elem.css('position').toLowerCase() != 'relative' && this.$elem.css('position').toLowerCase() != 'absolute') {
             this.$elem.css('position', 'relative');
         }
         
         if (this.$elem.data('bubbleForcePosition') === '' || this.$elem.data('bubbleForcePosition') === true) {
             this.options.forceDefaultPosition =  true;
         }
         else if (this.$elem.data('bubbleForcePosition') === false) {
             this.options.forceDefaultPosition = false;
         }
         
         var vPos = this.$elem.data('bubbleVpos'),
             hPos = this.$elem.data('bubbleHpos');
         
         if (vPos && (vPos ==='bottom' || vPos === 'top')) {
             this.options.vPos = vPos;
         }
         if (hPos && (hPos ==='left' || hPos === 'right')) {
             this.options.hPos = hPos;
         }
         
         
         if (this.$elem.data('bubbleDisableSideclick') === '' || this.$elem.data('bubbleDisableSideclick') === true) {
             this.options.disableSideClick =  true;
         }
         
         this.$area = this.$elem.closest('[data-bubble-area]');
         if (!this.$area.length) { this.$area = 'viewport'; }
         
         
         this.$toggler.on('click.' + this._name +'-event', $.proxy(function(e) {
             e.preventDefault();
 
             if (this.$content.attr('data-bubble-content-visible') != 'true') {
                 
                 setTimeout($.proxy(function() {
                     this.$elem.attr('data-bubble-visible', true);
                     
                     this.setPosition();
                     
                     this.$content.attr('data-bubble-content-visible', true);
             
                     if (!this.options.disableSideClick) {
                         $(document).on('click', this.handleDocumentClick);
                     }
                 }, this), 0);
             }
             else {
                 if (this.options.disableSideClick) {
                     this.$elem.attr('data-bubble-visible', false);
                     this.$content.attr('data-bubble-content-visible', false);
                 }
             }
             
         }, this));
            
    };
    
    Plugin.prototype.destroy = function () {
        $.data(this.elem, '_' + pluginName, null);
        this.$toggler.off('.' + this._name +'-event');
    };

    $.fn[pluginName] = function(arg) {
        
        var args = arguments;
        
        return this.each(function() {
            var d = $.data(this, '_' + pluginName);
            
            if (!d && (typeof arg === 'object' || typeof arg === 'undefined')) {
                $.data(this, '_' + pluginName, 
                new Plugin(this, arg));
            }
            else if (d && typeof arg === 'string' && typeof d[arg] === 'function') {
                d[arg].apply( d, Array.prototype.slice.call(args, 1));
            }
            return this;
        });
    };
})(jQuery);



// Dropdown plugin
;(function($) {

    var pluginName = 'dropdown',
        defaults = {
            disableSideClick: false,
            disableSelectClose: false
        };

    function Plugin(elem, options) {
        
        this.elem       = elem;
        this.$elem      = $(this.elem);

        this.options    = $.extend({}, defaults, options);
        this._defaults  = defaults;
        this._name      = pluginName;
        
        this.handleDocumentClick = handleDocumentClick.bind(this);
        
        this.init();
    }
    
    var handleDocumentClick = function(e) {
        var target = e.target;
        
        if ((!$.contains(this.$content.get(0), target) && target !== this.$content.get(0)) || ($.contains(this.$content.get(0), target) && $(target).attr('data-dropdown-close') !== undefined)) {
            this.$elem.attr('data-dropdown-visible', false);
            $(document).off('click', this.handleDocumentClick);
        }
    };
    
    Plugin.prototype.hide = function() {
        this.$elem.attr('data-dropdown-visible', false);
        $(document).off('click', this.handleDocumentClick);
    };

    Plugin.prototype.init = function() {
        this.$toggler = this.$elem.find('[data-dropdown-toggler]');
        this.$content = this.$elem.find('[data-dropdown-content]');
        this.$input = this.$elem.find('input[data-dropdown-hidden-input]');
        this.$indicator = this.$elem.find('[data-dropdown-indicator]');
        
        
        if (this.$elem.data('dropdownDisableSideclick') === '' || this.$elem.data('dropdownDisableSideclick') === true) {
            this.options.disableSideClick =  true;
        }
        
        if (this.$elem.data('dropdownDisableSelectClose') === '' || this.$elem.data('dropdownDisableSelectClose') === true) {
            this.options.disableSelectClose = true;
        }
        
        
        this.$toggler.on('click.' + this.pluginName + '-event', $.proxy(function(e) {
            e.preventDefault();
            if (this.$content.length) {
                if (this.$elem.attr('data-dropdown-visible') !== 'true') {    
                    setTimeout($.proxy(function() {
                        this.$elem.attr('data-dropdown-visible', true);
                        
                        if (!this.options.disableSideClick) {
                            $(document).on('click', this.handleDocumentClick);
                        }
                    }, this), 0);
                }
                else {
                    this.$elem.attr('data-dropdown-visible', false);
                }
            }
                
        }, this));
        
        this.$content.on('click.' + this.pluginName + '-event', '[data-dropdown-option]', $.proxy(function(e) {
            e.preventDefault();
                
            var $target = $(e.target),
                value = $target.data('dropdownValue'),
                title = $target.html();

            if (this.$input.length) { this.$input.val(value); }
            this.$indicator.html(title);
            
            
            if (!this.options.disableSelectClose) {
                this.$elem.dropdown('hide');
            }
            
            this.$elem.trigger('change:dropdown', {
                $elem : this.$elem,
                context: this,
                value : value,
                title: title
            });
        }, this));
    };
    
    Plugin.prototype.destroy = function () {
        $.data(this.elem, '_' + pluginName, null);
        this.$toggler.off('.' + this._name + '-event');
        this.$content.off('.' + this._name + '-event');
    };

    $.fn[pluginName] = function(arg) {
        
        var args = arguments;
        
        return this.each(function() {
            var d = $.data(this, '_' + pluginName);
            
            if (!d && (typeof arg === 'object' || typeof arg === 'undefined')) {
                $.data(this, '_' + pluginName, 
                new Plugin(this, arg));
            }
            else if (d && typeof arg === 'string' && typeof d[arg] === 'function') {
                d[arg].apply( d, Array.prototype.slice.call(args, 1));
            }
            return this;
        });
    };
})( jQuery );