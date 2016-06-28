(function($) {

    var Modal = function(tpl, options) {

        this.settings = $.extend({
            closeOnEscape: true,
            handleScrollTop: true,
            removeOnClose: false,
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

            this.$_container = $('<div />').addClass('modal').data('modal', this);
            
            this.$_container.on('click', '[data-modal-close]', this.handleModalCloseClick);
            
            
            var structure = '<div class="modal-inner">' +
                                '<div class="modal-popup">' +
                                    '<div class="modal-header modal-header-type-1"><a href="#" class="ico ico-type-17 ico-color-type-1" data-modal-close></a></div>'+
                                    '<div class="modal-header modal-header-type-2">' +
                                        '<a href="#" data-modal-close>Close full view <span class="ico ico-type-16 ico-color-type-1" data-modal-close></span></a>' +
                                    '</div>' +
                                    '<div class="modal-content"></div>' +
                                '</div>' +
                            '</div>';
                                        
            this.$_container.append(structure);
            this.$_popup = this.$_container.find('.modal-popup');
            this.$_content = this.$_container.find('.modal-content');

            $('body').append(this.$_container);
            
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
            this.$_content.empty().append(html);
        },

        show: function() {

            if (this.settings.setScrollTop) {
                this.html_of = $('html').css('overflow');
                this.body_of = $('body').css('overflow');

                $('body, html').css('overflow', 'hidden');
                this.scrollTop = $(window).scrollTop();
            }

            $('html').addClass('modal-is-open');
            
            if (this.settings.isStatic) {
                this.$_container.addClass('modal-is-static');
            }
            else {
                this.$_container.removeClass('modal-is-static');
            }
            
            this.$_popup.addClass('modal-popup-hidden');
            this.$_container.trigger('beforeShow');
            
            this.$_container.addClass('modal-is-visible');
            
            if (this.settings.setPosition) {
                this.setPosition();
            }
            
            this.$_popup.removeClass('modal-popup-hidden');
            
            $(window).on('resize', this.handleResize);
            $(window).on('orientationchange', this.handleResize);
            $(document).on('keyup', this.handleDocumentKeyup);
            
            this.$_container.trigger('afterShow');
        },

        hide: function() {
            
            this.$_container.trigger('beforeHide');
            
            this.$_container.removeClass('modal-is-visible');
            
            $('html').removeClass('modal-is-open');
            
            if (this.settings.setScrollTop) {
                $('html').css('overflow', this.html_of);
                $('body').css('overflow', this.body_of);
                $(window).scrollTop(this.scrollTop);
            }
            
            $(window).off('resize', this.handleResize);
            $(window).off('orientationchange', this.handleResize);
            $(document).off('keyup', this.handleDocumentKeyup);
            
            this.$_container.trigger('afterHide');
            
            if (this.settings.removeOnClose) {
                this.$_container.trigger('beforeRemove');
                this.$_container.remove();
            }
        },

        getContainer: function() {
            return this.$_container;
        },
        
        setOption: function(attr, value) {
            this.settings[attr] = value;
        }
    };

    $.modal = Modal;

}(jQuery));
