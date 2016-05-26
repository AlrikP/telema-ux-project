var App = {
    init: function() {
        
        // Toggle elements visibility
        $(document).on('click','.js-visibility-toggler', function(e) {
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
    }
        /*
        $('.js-person-modal').on('click', $.proxy(function(e) {
            e.preventDefault();
            
            var $target = $(e.target),
                $parent = $target.closest('.person'),
                data = $parent.data();
                
            if (!this.personModal) {
                this.personModal = new $.modal('#person-modal-tpl', {
                    removeOnClose: false
                });
            }
            
            this.personModal.getContainer()
                .find('.name').empty().append(data.name).end()
                .find('.position').empty().append(data.position).end()
                .find('.info').empty().append(data.info);
            
            this.personModal.show();
            
        }, this));
        
        
        $('.js-menu-toggler').on('click', $.proxy(function(e) {
            e.preventDefault();
            
            var $target = $(e.target);
                
            if (!this.menuModal) {
                this.menuModal = new $.modal('#menu-modal-tpl', {
                    removeOnClose: false,
                    modalClass: 'modal-menu'
                });
                this.menuModal.getContainer()
                    .on('afterShow', function() {
                        $('html').addClass('modal-menu-open');
                    })
                    .on('afterHide', function() {
                        $('html').removeClass('modal-menu-open');
                    });
                    
                $('body').on('closeAllModals', $.proxy(function() {
                    this.menuModal.hide();
                }, this));
            }
            
            if (!this.menuModal.isOpen) {
                this.menuModal.show();
            }
            else {
                this.menuModal.hide();
            }
        }, this));
        
        $('.js-search-toggler').on('click', $.proxy(function(e) {
            e.preventDefault();
            
            var $target = $(e.target);
                
            if (!this.searchModal) {
                this.searchModal = new $.modal('#search-modal-tpl', {
                    removeOnClose: false,
                    modalClass: 'modal-search'
                });
                
                var $container = this.searchModal.getContainer(),
                    $textbox_parent = $container.find('.textbox-button');
                
                
                $container
                    .on('initState', function() {
                        $textbox_parent.removeClass('is-filled').find('input[type=text]').val('');
                        $container.find('.results').hide();
                        $container.closest('.modal').removeClass('modal-portrait');
                    })
                    .on('beforeShow', function() {
                        $('body').trigger('closeAllModals');
                    })
                    .find('.js-input-clear').on('click', function(e) {
                        e.preventDefault();
                        $textbox_parent.removeClass('is-filled').find('input[type=text]').val('');
                        $container.find('.results').hide();
                        
                    }).end()
                    .find('input[type=text]').on('keyup', function() {
                        if ($(this).val()) {
                            $textbox_parent.addClass('is-filled');
                        }
                        else {
                            $textbox_parent.removeClass('is-filled');
                        }
                    }).end()
                    .find('form').on('submit', function(e) {
                        e.preventDefault();
                        
                        var $search_box = $container.find('.search-box'),
                            offset = $search_box.parent().offset().top,
                            speed = 200;
                            
                        if (offset) {
                            $search_box
                                .css('padding-top', offset + 'px')
                                .animate({
                                    'padding-top':'40px'
                                }, speed);
                        }
                        $container.closest('.modal').addClass('modal-portrait');
                        
                        
                        // TODO: search request
                        // show results when ajax request complete.
                        // $container.find('.results').show();
                        
                        // timeout is just for prototype. search request takes time anyway
                        setTimeout(function() {
                            $container.find('.results').show();
                        }, 2*speed);
                        
                        
                        return false;
                    });
                    
            }
            
            if (!this.searchModal.isOpen) {
                this.searchModal.getContainer().trigger('initState');
                this.searchModal.show();
            }
            else {
                this.searchModal.hide();
            }
        }, this));
        
        
        $('.js-row-list-toggler').on('click', function(e) {
            e.preventDefault();
            $('body').toggleClass('row-list-toggled');
        });
        
        $('.js-custom-select').customSelect();
        
        $('.form').on('click', '.js-row-clone', function(e) {
            e.preventDefault();
            var $target = $(e.target),
                $parent = $target.closest('.row-group');
                
            if (!$parent.length) { $parent = $target.closest('.row'); }
                
            $parent.after($parent.clone());
            $target.remove();
            $('.js-custom-select').customSelect();
        });
        
        $('.js-row-items-toggle').on('click', function(e) {
            e.preventDefault();
            var $parent = $(e.target).closest('.row'),
                $visible = $parent.find('[data-visible=true]'),
                $hidden = $parent.find('[data-visible=false]');
                
            $visible.attr('data-visible',false);
            $hidden.attr('data-visible', true).filter('input[type=text]').first().focus();
        });
        
        $('.js-search-expand').on('click', function(e) {
            e.preventDefault();
            var $target = $(e.target),
                $parent = $target.parent(),
                $row = $parent.closest('.row'),
                $form = $row.closest('form');
                
            $form.find('.search-options').addClass('expand');
            $parent.remove();
            $row.removeClass('no-padding').find('.textbox-button').removeClass('textbox-button').find('input[type=submit]').remove();
        });
    }
        */
};

$(function() {
    App.init();
});



;(function($) {

    var Modal = function(tpl, options) {

        this.settings = $.extend({
            closeOnSideClick: true,
            closeOnEscape: true,
            handleScrollTop: true,
            removeOnClose: true,
            setScrollTop: true,
            isStatic: false,
            setPosition: true
        }, options);
        this._id = Math.round(new Date().getTime());
        this._tpl = tpl;
        
        this._init();
    };

    Modal.prototype = {

        _init: function() {

            this.handleDocumentKeyup = $.proxy(this.handleDocumentKeyup, this);
            this.handleResize = $.proxy(this.handleResize, this);
            this.handleModalCloseClick = $.proxy(this.handleModalCloseClick, this);

            this.$_container = $('<div />').addClass('modal');

            if (this.settings.modalClass) { this.$_container.addClass(this.settings.modalClass); }
            if (this.settings.zIndex) { this.$_container.css('z-index', this.settings.zIndex); }
            if (this.settings.isStatic) { this.$_container.addClass('modal--is-static'); }
            
            this.$_container
                .on('click', '.js-modal-close', this.handleModalCloseClick)
                .append('<div class="modal-popup"></div>');
            
            this.$_popup = this.$_container.find('.modal-popup');
            this.$_popup.append($(this._tpl).html());

            $('body').append(this.$_container);

            if (this.settings.closeOnSideClick) {
                
                this.$_container.on('click', $.proxy(function(e) {

                    var target = e.target,
                        $catcher = this.$_container.find('.js-modal-clickcatcher');
                    
                    
                    if ($catcher.length) {
                        if (!$.contains($catcher.get(0), target) && $catcher.get(0) !== target) {
                            this.hide();
                        }
                    }
                    else {
                        if (target === this.$_container.get(0) || target === this.$_container.children().get(0)) {
                            this.hide();
                        }
                    }
                }, this));
            }
            
            
            this.isOpen = false;
            this.$window = $(window);
        },

        handleDocumentKeyup: function(event) {
            if (event.keyCode == 27 && this.settings.closeOnEscape) {
                this.hide();
            }
        },

        handleResize: function() {
            if (this.settings.setPosition) {
                this.setPosition();
            }
        },

        handleModalCloseClick: function(e) {
            e.preventDefault();
            this.hide();
        },

        setPosition: function() {
            
            var height = this.$_popup.outerHeight(),
                width = this.$_popup.outerWidth(),
                dimensions = [this.$window.height(), this.$window.width()];
            
            this.$_popup.css({
                'position' : 'absolute',
                'top': '50%',
                'left': '50%',
                'margin-top': -height / 2,
                'margin-left': -width / 2
            });

            if (height > dimensions[0]) { this.$_popup.css({'top': '0px', 'margin-top': '0'}); }
            if (width > dimensions[1]) { this.$_popup.css({'left': '0px', 'margin-left': '0'}); }
        },

        

        setContent: function(html) {
            this.$_popup.empty().append(html);
        },

        show: function() {

            this.$_container.trigger('beforeShow');
            
            if (this.settings.setScrollTop) {
                this.html_of = $('html').css('overflow');
                this.body_of = $('body').css('overflow');

                $('body, html').css('overflow', 'hidden');
                this.scrollTop = $(window).scrollTop();
            }

            $('html').addClass('modal-open');

            this.$_popup.addClass('modal-popup-hidden');
            this.$_container.addClass('modal--is-visible');
            
            if (this.settings.setPosition) {
                this.setPosition();
            }
            
            $(window).on('resize', this.handleResize);
            $(window).on('orientationchange', this.handleResize);
            $(document).on('keyup', this.handleDocumentKeyup);
            
            this.$_popup.removeClass('modal-popup-hidden');
            this.$_container.trigger('afterShow');
            this.isOpen = true;
        },

        hide: function() {
            
            this.$_container.trigger('beforeHide');

            if (this.settings.setScrollTop) {
                $('html').css('overflow', this.html_of);
                $('body').css('overflow', this.body_of);
                $(window).scrollTop(this.scrollTop);
            }
            $('html').removeClass('modal-open');
            this.$_container.removeClass('modal--is-visible');
            
            
            $(window).off('resize', this.handleResize);
            $(window).off('orientationchange', this.handleResize);
            $(document).off('keyup', this.handleDocumentKeyup);
            
            this.$_container.trigger('afterHide');
            
            if (this.settings.removeOnClose) {
                this.$_container.remove();
            }
            this.isOpen = false;
        },

        getContainer: function() {
            return this.$_container;
        }
    };

    $.modal = Modal;

}(jQuery));

;(function ( $ ) {

    var pluginName = 'customSelect',
        defaults = { };

    function Plugin( element, options ) {
        
        this.element    = element;
        this.$element   = $(element);

        this.options    = $.extend( {}, defaults, options );
        this._defaults  = defaults;
        this._name      = pluginName;
        
        this.init();
    }
    
    var update = function() {
        
        var val = this.$element.find( ':selected' ).text();
        if (!val || val === '') {
            val = this.$element.data('placeholder');
            this.$element.addClass('has-placeholder');
        }
        else {
            this.$element.removeClass('has-placeholder');
        }
        this.$content.text(val);
        
    };

    Plugin.prototype.init = function () {
        
        this.$content = this.$element.children('div');
        
        update.bind(this)();
        
        this.$element
            .on('change.custom-select keyup.custom-select', 'select', $.proxy(update, this))
            .on('update.custom-select', $.proxy(update, this ));
    };
    
    Plugin.prototype.destroy = function () {
        $.data( this.element, pluginName, null );
        this.$element.off( '.custom-select' );
    };

    $.fn[ pluginName ] = function ( arg ) {
        
        var args = arguments;
        
        return this.each(function () {
            var d = $.data( this, pluginName );
            
            if ( !d && (typeof arg === 'object' || typeof arg === 'undefined' )) {
                $.data( this, pluginName, 
                new Plugin( this, arg ));
            }
            else if ( d && typeof arg === 'string' && typeof d[arg] === 'function') {
                d[ arg ].apply( d, Array.prototype.slice.call( args, 1 ));
            }
            
            return this;
        });
    };
})( jQuery );
