var Framework = {
    init: function() {
        
        
        // moment.locale('et');
        moment.updateLocale('en', {
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
        
        
        $('[data-modal]').on('click', $.proxy(function(e) {
            e.preventDefault();
            
            var $target = $(e.target),
                tpl = $target.data('modalTpl'),
                id = $target.data('modalId'),
                type = $target.data('modalType') || 1,
                removeOnClose = $target.data('modalRemove') || undefined,
                modal, $container;
            
            if (!this.modals) { this.modals = {}; } 
            
            if (id) {
                if (!this.modals[id]) {
                    this.modals[id] = new $.modal();
                }
                modal = this.modals[id];
            }
            else {
                modal = new $.modal();
                modal.setOption('removeOnClose', true);
            }
            
            if (removeOnClose !== undefined) {
                modal.setOption('removeOnClose', removeOnClose);
            }
            
            $container = modal.getContainer().attr('data-modal-type', type);
            
            $container.on('beforeRemove', $.proxy(function() {
                if (this.modals[id]) { delete this.modals[id]; }
            }, this));

            modal.setContent($('#' + tpl).html());
            modal.show();
            
        }, this));
        
        
        // Bubble widget
        $('[data-bubble]').bubble();
        
        
        // Dropdown widget
        $('[data-dropdown]').dropdown();
        
        
        // Sorter
        $('[data-sorter]').sorter();
        
        
        // Form attachment
        $('[data-form-attachment]').formAttachment();
        
        
        // Clean radio buttons and checboxes cached values
        $('input[type=radio], input[type=checkbox]').each(function(i, el) {
            $(el).prop('checked', $(el).attr('checked') === 'checked' ? true : false);
        });
        
        
        // Date selector
        $('[data-date-selector-marker]').click(function(e) {
            e.preventDefault();
            var $target = $(e.target),
                $parent = $target.closest('[data-date-selector-parent]'),
                $start_input = $parent.find('[data-date-selector-start]').not($parent.find('[data-date-selector-parent] [data-date-selector-start]')),
                $end_input = $parent.find('[data-date-selector-end]').not($parent.find('[data-date-selector-parent] [data-date-selector-end]')),
                format = 'DD.MM.YYYY',
                type = $target.data('dateSelectorMarker') || 'today',
                start_format = $start_input.data('dateFormat') || format,
                end_format = $end_input.data('dateFormat') || format,
                $picker_start = $parent.find('[data-date-picker=start]'),
                $picker_end = $parent.find('[data-date-picker=end]');
            
            if (type == 'today') {
                $start_input.val(moment().format(start_format));
                $end_input.val(moment().format(end_format));
            }
            else if (type == 'yesterday') {
                $start_input.val(moment().add(-1, 'days').format(start_format));
                $end_input.val(moment().add(-1, 'days').format(end_format));
            }
            else if (type == 'last-7') {
                $start_input.val(moment().add(-6, 'days').format(start_format));
                $end_input.val(moment().format(end_format));
            }
            else if (type == 'last-30') {
                $start_input.val(moment().add(-29, 'days').format(start_format));
                $end_input.val(moment().format(end_format));
            }
            else if (type == 'last-week') {
                $start_input.val(moment().add(-1, 'weeks').startOf('week').format(start_format));
                $end_input.val(moment().add(-1, 'weeks').endOf('week').format(end_format));
            }
            else if (type == 'last-month') {
                $start_input.val(moment().add(-1, 'months').startOf('month').format(start_format));
                $end_input.val(moment().add(-1, 'months').endOf('month').format(end_format));
            }
            else if (type == 'this-week') {
                $start_input.val(moment().startOf('week').format(start_format));
                $end_input.val(moment().endOf('week').format(end_format));
            }
            else if (type == 'this-month') {
                $start_input.val(moment().startOf('month').format(start_format));
                $end_input.val(moment().endOf('month').format(end_format));
            }
            else if (type == 'next-7') {
                $start_input.val(moment().add(1, 'days').format(start_format));
                $end_input.val(moment().add(7, 'days').format(end_format));
            }
            
            else if (type == 'bubble') {
                var $bubble = $target.closest('[data-bubble]');
                $bubble
                    .closest('[data-date-selector-parent]')
                    .find('[data-date-selector-start]')
                    .not($bubble.find('[data-date-selector-parent] [data-date-selector-start]'))
                    .val($start_input.val());
                    
                $bubble
                    .closest('[data-date-selector-parent]')
                    .find('[data-date-selector-end]')
                    .not($bubble.find('[data-date-selector-parent] [data-date-selector-end]'))
                    .val($end_input.val());
            }
            
            if ($picker_start.length) {
                $picker_start.datepicker( "setDate", moment($start_input.val(), start_format).toDate());
            }
            if ($picker_end.length) {
                $picker_end.datepicker( "setDate", moment($end_input.val(), end_format).toDate());
            }
        });
        
        
        // Datepicker
        $('[data-date-picker]').each(function(i, el) {
            var $picker = $(el);
                $altfield = $picker.prev('input[type=text]'),
                altfield = $altfield.length ? $altfield.get(0) : '';
            
            $picker.datepicker({
                altField: altfield,
                dateFormat: 'dd.mm.yy' 
            });
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
        $(document).on('click','[data-notification-close]', function(e) {
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
        $('[data-list-filter]').each(function(i, el) {
            var $parent = $(el),
                $input = $parent.find('[data-list-filter-input]'),
                $items = $parent.find('[data-list-filter-item]'),
                $empty = $parent.find('[data-list-filter-empty]');
            
            $input.on('keyup', function(event) {
                var val = $input.val();
                if ($.trim(val) !== '') {
                    $empty.hide();
                    $items.hide().each(function(j, item) {
                        var $item = $(item),
                            item_val = $.trim($(item).data('listFilterItem'));
                    
                        var patt = new RegExp(val,'i');
                        if (patt.test(item_val)) {
                            $item.show();
                        } 
                    });
                    
                    if(!$items.filter(':visible').length) {
                        $empty.show();
                    }
                }
                else {
                    $items.show();
                }
            });
        });
        
        
        // Flipper
        if (!Modernizr.csstransforms3d) {
            $('[data-flipper].fixed').each(function() {
                $(this).find('.flipper-back').height($(this).find('.flipper-front').height());
            });
        }

        $('[data-flipper-toggler]').on('click', function(e) {
            e.preventDefault();
            var $parent = $(e.target).closest('[data-flipper]');
            
            if ($parent.attr('data-flipper-flipped') !== 'true') { 
                $parent.attr('data-flipper-flipped', true);
            }
            else {
                $parent.attr('data-flipper-flipped', false);
            }
        });
        
        
        // PDF Viewer
        $('[data-pdf-open]').on('click', function(e) {
            e.preventDefault();
            
            var id = $(this).data('pdfId');
            if (id) {
                $('.pdf-holder[data-pdf-id='+id+']').addClass('pdf-holder-visible');
            }
        });
        $('[data-pdf-close]').on('click', function(e) {
            e.preventDefault();
            $(this).closest('.pdf-holder').removeClass('pdf-holder-visible');
        });
        
    }
};

$(function() {
    Framework.init();
});


// Bubble plugin
;(function($) {

    var pluginName = 'bubble',
        defaults = {
            vPos : 'bottom',
            hPos : 'left',
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
        if ($(target).closest('body').length && ((!$.contains(this.$content.get(0), target) && target !== this.$content.get(0)) || ($.contains(this.$content.get(0), target) && $(target).attr('data-bubble-close') !== undefined))) {
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
            if (checkNum > Math.round(this.$content.offset().left)) {
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
        
        if ($(target).closest('body').length && ((!$.contains(this.$content.get(0), target) && target !== this.$content.get(0)) || ($.contains(this.$content.get(0), target) && $(target).attr('data-dropdown-close') !== undefined))) {
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
})(jQuery);


// Sorter plugin
;(function($) {

    var pluginName = 'sorter',
        defaults = {
        };

    function Plugin(elem, options) {
        
        this.elem       = elem;
        this.$elem      = $(this.elem);

        this.options    = $.extend({}, defaults, options);
        this._defaults  = defaults;
        this._name      = pluginName;
        
        this.init();
    }
    

    Plugin.prototype.init = function() {
        this.$items = this.$elem.find('[data-sorter-item]');
        this.$holder = this.$elem.find('[data-sorter-items]');
        
        this.$elem.on('click.' + this.pluginName + '-event','[data-sorter-attr]', $.proxy(function(e) {
            e.preventDefault();
            var $target = $(e.target),
                attr = $target.data('sorterAttr'),
                type = $target.data('sorterType');
                
            this.sort(attr, type);
        }, this));       
    };
    
    Plugin.prototype.sort = function(sortBy, type) {
        
        var $sorted = _.sortBy(this.$items, function(item){ 
            return $(item).data('sorterItem')[sortBy];
        });
        
        if (type == "desc") { $sorted.reverse(); }
        
        this.$holder.append($sorted);
        
    };
    
    Plugin.prototype.destroy = function () {
        $.data(this.elem, '_' + pluginName, null);
        this.$$elem.off('.' + this._name + '-event');
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


// Form attachment
;(function($) {

    var pluginName = 'formAttachment',
        defaults = {
        };

    function Plugin(elem, options) {
        
        this.elem       = elem;
        this.$elem      = $(this.elem);

        this.options    = $.extend({}, defaults, options);
        this._defaults  = defaults;
        this._name      = pluginName;
        
        this.init();
    }
    

    Plugin.prototype.init = function() {
        
        this.$input = this.$elem.find('[data-form-attachment-input]');
        this.$list = this.$elem.find('[data-form-attachment-list]');
        this.$item = this.$elem.find('[data-form-attachment-item]');
        
        this.$elem.on('change.' + this.pluginName + '-event','[data-form-attachment-input]', $.proxy(function(e) {
            
            var $target = $(e.target),
                value = $target.val();
            
            if (value.length) {
                this.$item.text(value);
                this.$list.show();
            } 
        },this));
        
        this.$elem.on('click.' + this.pluginName + '-event','[data-form-attachment-clear]', $.proxy(function(e) {
            e.preventDefault();
            this.clear();
        }, this));
    };
    
    Plugin.prototype.clear = function() {
        console.log('siin');
        if (this.$input.length) {
            this.$input.wrap('<form>').closest('form').get(0).reset();
            this.$input.unwrap();
            this.$list.hide();
        }
    };
    
    Plugin.prototype.destroy = function () {
        $.data(this.elem, '_' + pluginName, null);
        this.$$elem.off('.' + this._name + '-event');
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