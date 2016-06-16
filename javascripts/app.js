var App = {
    init: function() {
        
        // Support form submit
        $('.support form').submit(function(e) {
            e.preventDefault();
            
            var $form = $(this),
                $support = $(this).closest('.support'),
                $error = $support.find('.support-error'),
                $success = $support.find('.support-success'),
                $attachment = $support.find('input[type=file]'),
                show_error = false;
            
            
            if ($attachment.val() && (!/(\.gif|\.jpg|\.jpeg|\.doc|\.xls)$/i.test($attachment.val()))) {
                show_error = 1;
            }
            
            if (show_error) {
                $('[data-support-error]')
                    .hide()
                    .filter('[data-support-error='+show_error+']').show();
                
                $error.show();
                $error.find('.btn').one('click', function(e) { 
                    e.preventDefault(); 
                    $error.hide(); 
                });
            }
            else {
                // Make ajax send request here and on complete show success
                $success.show();
                $success.find('.btn').one('click', function(e) {
                    e.preventDefault(); 
                    $success.hide(); 
                    $form.formAttachment('clear');
                });
            }
        });
        
        
        // Main search
        $('[data-search-main]').autocomplete({
            source: function(request, response) {
                var data = [
                    { value: 'Kuke pood', category: 'Companies', url: 'http://google.com' },
                    { value: 'Kuke pagariäri', category: 'Companies', url: 'http://google.com' },
                    { value: 'Kuke pood Põlva branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pood Pärnu branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Viinistu branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Haapsalu branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Puhja branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Puka branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pood Tartu branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pood Tallinn branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pood Elva branch', category: 'Branches', url: 'http://google.com' }
                ];

                var results = $.ui.autocomplete.filter(data, request.term),
                    lang_noResults = this.element.data('langNoResults') || 'No matches found';
                
                if (!results.length) {
                    response([{ category: 'Branches', value: lang_noResults, empty: true }, { category: 'Companies', value: lang_noResults, empty: true}]);
                } else {
                    response(results);
                }
            },
            select: function(e, ui) {
                if (ui.item.url) { window.location = ui.item.url; }
            },
            create: function(e, ui) {
                
                var lang_documents = $(e.target).data('langDocuments') || 'Documents',
                    lang_company_page = $(e.target).data('langCompanyPage') || 'Company page',
                    documents_url = $(e.target).data('documentsUrl') || '#',
                    lang_search_documents = $(e.target).data('langSearchDocuments') || 'Search from documents',
                    isAdvanced = $(e.target).data('searchMainAdvanced') !== undefined;
                
                $(e.target).data('ui-autocomplete')._renderItem = function( ul, item ) {
                    if (item.empty) {
                        return $( "<li>" )
                            .append( item.value )
                            .appendTo( ul );
                    }
                    else {
                        var item_content = item.value;
                        if (isAdvanced) {
                            item_content += '<div class="meta"><a href="'+ documents_url+ '">'+ lang_documents +'</a> | <a href="'+ item.url +'">' + lang_company_page +'</a></div>';

                        }
                        return $( "<li>" )
                            .append( item_content ).on('click', 'a', function(e) { e.stopPropagation(); })
                            .appendTo( ul );
                    }
                };
                
                
                $(e.target).data('ui-autocomplete')._renderMenu = function(ul, items) {
                    var currentCategory = '';
                    $('<li class="ui-autocomplete-top-link"><a href="#">'+ lang_search_documents+'</a></li>')
                        .data("ui-autocomplete-item", { value:"" })
                        .appendTo(ul);
                    
                    $.each(items, $.proxy(function(index, item) {
                        var li;

                        if (item.category != currentCategory) {
                            currentCategory = item.category;
                            $('<li class="ui-autocomplete-category">'+ item.category+'</li>')
                                .data("ui-autocomplete-item", { value:"" })
                                .appendTo(ul);
                        }
                        li = this._renderItemData(ul, item);

                        if (item.category) {
                            li.attr('aria-label', item.category + ' : '+ item.value);
                        }
                    }, this));
                };
            }
        });
        
        
        // Search examples
        $('[data-search-1]').autocomplete({
            source: function(request, response) {
                var data = [
                    { value: 'Document can not be found', url: 'http://google.com' },
                    { value: 'Document is invalid', url: 'http://google.com' },
                    { value: 'Document problems', url: 'http://google.com' }
                ];

                var results = $.ui.autocomplete.filter(data, request.term);
                response(results);
            },
            select: function(e, ui) {
                if (ui.item.url) { window.location = ui.item.url; }
            },
            create: function(e, ui) {
                $(e.target).data('ui-autocomplete')._renderMenu = function(ul, items) {
                    $.each(items, $.proxy(function(index, item) {
                        this._renderItemData(ul, item);
                    }, this));
                    $('<li class="ui-autocomplete-more-link">Customer support &raquo;</li>')
                        .data("ui-autocomplete-item", { value:"", url: 'http://www.google.ee' })
                        .appendTo(ul);
                };
            }
        });
        
        
        $('[data-search-2]').autocomplete({
            source: function(request, response) {
                var data = [
                    { value: 'Kuke pood', category: 'Companies', url: 'http://google.com' },
                    { value: 'Kuke pagariäri', category: 'Companies', url: 'http://google.com' },
                    { value: 'Kuke pood Põlva branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pood Pärnu branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Viinistu branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Haapsalu branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Puhja branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Puka branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pood Tartu branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pood Tallinn branch', category: 'Branches', url: 'http://google.com' },
                    { value: 'Kuke pood Elva branch', category: 'Branches', url: 'http://google.com' }
                ];

                var results = $.ui.autocomplete.filter(data, request.term),
                    lang_noResults = this.element.data('langNoResults') || 'No matches found';
                
                if (!results.length) {
                    response([{ category: 'Branches', value: lang_noResults, empty: true }, { category: 'Companies', value: lang_noResults, empty: true}]);
                } else {
                    response(results);
                }
            },
            select: function(e, ui) {
                if (ui.item.url) { window.location = ui.item.url; }
            },
            create: function(e, ui) {                
                $(e.target).data('ui-autocomplete')._renderItem = function( ul, item ) {
                    if (item.empty) {
                        return $( "<li>" )
                            .append( item.value )
                            .appendTo( ul );
                    }
                    else {
                        var item_content = item.value;
                        return $( "<li>" )
                            .append( item_content )
                            .appendTo( ul );
                    }
                };
                
                $(e.target).data('ui-autocomplete')._renderMenu = function(ul, items) {
                    var currentCategory = '';
                    
                    $.each(items, $.proxy(function(index, item) {
                        var li;
                        if (item.category != currentCategory) {
                            currentCategory = item.category;
                            $('<li class="ui-autocomplete-category">'+ item.category+'</li>')
                                .data("ui-autocomplete-item", { value:"" })
                                .appendTo(ul);
                        }
                        li = this._renderItemData(ul, item);
                        if (item.category) {
                            li.attr('aria-label', item.category + ' : '+ item.value);
                        }
                    }, this));
                };
            }
        });
        
        $('[data-search-3]').autocomplete({
            source: function(request, response) {
                var data = [
                    { value: 'Kuke pood', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pagariäri', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pood Põlva branch', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pood Pärnu branch', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Viinistu branch', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Haapsalu branch', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Puhja branch', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pagariäri Puka branch', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pood Tartu branch', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pood Tallinn branch', desc: 'Reg. 12345678', url: 'http://google.com' },
                    { value: 'Kuke pood Elva branch', desc: 'Reg. 12345678', url: 'http://google.com' }
                ];
                
                var results = $.ui.autocomplete.filter(data, request.term);
                response(results);
            },
            select: function(e, ui) {
                if (ui.item.url) { window.location = ui.item.url; }
            },
            create: function(e, ui) {                
                $(e.target).data('ui-autocomplete')._renderItem = function( ul, item ) {
                    return $( "<li>" )
                        .append( item.value + '<div class="meta">' + item.desc + '</div>' )
                        .appendTo( ul );
                };
            }
        });
        
        
        $('[data-people-autocomplete]').autocomplete({
            source: function(request, response) {
                var data = [
                    { value: 'Fionnula Tambling-Goggin / Product manager' },
                    { value: 'Arthur Nightingale / Project manager' },
                    { value: 'Cordelia Ditton / Project manager' },
                    { value: 'Derek Honeybun / Product manager' },
                    { value: 'Fionnula Tambling-Goggin / Product manager' }
                ];
                
                var results = $.ui.autocomplete.filter(data, request.term);
                response(results);
            }
        });
        
        
        $(document).on('change', '[data-resolver-toggler]', function() {
            var val = $(this).prop('checked');
            $(this).closest('[data-resolver]').toggleClass('resolved', val);
        });
    }
};

$(function() {
    App.init();
});