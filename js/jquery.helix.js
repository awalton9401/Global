(function ( $ ) {
    function defaultHandler(){}
    
    function init(that, config)
    {
        var widget = that.data("helix");
        
        if(widget) return widget;
        
        var menu = $("<div>").addClass("helix").addClass("menu").addClass( config.horizontal === false ? "vertical" : "horizontal");
        var items = {};
        var selected = {};
        
        config.handlers = config.handlers || {};        
        $(that).append(menu);
        
        widget = {
            add: function(item){
                config.items.splice(item.position, 0, item.item);                
                config.handlers[item.item.name] = item.handler;
                
                widget.render();                
            },
            fixed: function(fixed){
                if(fixed) menu.addClass("fixed");
                else menu.removeClass("fixed");
                
                return widget;
            },
            remove: function(position){
                config.items.splice(position, 1);
                
                widget.render();  
            },
            render: function(){
                var menuItem;
                var name;
				var page = $(document);
                
                menu.empty();
                
                if(config.smallMenu)
                {
                    menu.append($("<div>")
                        .addClass("hamburger")
                        .text("\u2630")
                        .click(function(){
                            $(this).parent(".helix").find(".item").toggle();
                        })
                    );
                }
                
                if(config.logo)
                {
                    menu.append($("<div>").addClass("logoContainer")
                        .append($("<img>")
                            .addClass("logo")
                            .attr("src", config.logo))
                    );    
                }
                
                $.each(config.items, function(index, item){
                    var state;
                    
                    name = item.name;
                    
                    state = {
                        menu: widget,
                        value: item
                    };
                    
                    menuItem = $("<div>").addClass("item").addClass(config.smallMenu ? "smallMenu" : "").addClass(((selected.name || config.selected) === name) ? "selected" : "").text(name).click(function(){
                        
                        if($(this).hasClass("selected")) return;
                        
                        selected = item;
                        
                        $(this).parent(".helix").find(".item").removeClass("selected");
                        $(this).addClass("selected");
                        
                        (config.handlers[item.name] || config.handlers["handler"] || defaultHandler)(state);
                    });
                    
                    items[item.name] = menuItem;
                    
                    if(config.hidden && config.hidden.some(x => x === item.name)) menuItem.addClass("hidden");
                    if(menuItem.hasClass("selected")) selected = item;
                    
                    menu.append(menuItem);
                });
                
                if(config.fixedHeight)
                {
                    page.scroll(function(data){
                        if($(this).scrollTop() > config.fixedHeight) 
                        {
                            if(!$(".hamburger").is(":visible"))
                            {
                                widget.fixed(true).small(true);
                                $("#header").addClass("small");
                            }
                        }
                        else 
                        {
                            if(!$(".hamburger").is(":visible"))
                            {
                                widget.fixed(false).small(false);
                                $("#header").removeClass("small");
                            }
                        }
                    });   
                }
            },
            show: function(newConfig){
                if(newConfig.show == false) items[newConfig.item.name].hide();
                else items[newConfig.item.name].show();
            },
            select: function(newSelected){
                if(newSelected) selected = items[newSelected];
                else return selected;
                if(items[newSelected]) items[newSelected].click();
                
                widget.render();
            },
            small: function(small){
                if(small) menu.addClass("small");
                else menu.removeClass("small");
                
                return widget;
            },
            smallMenu: function(){
                return $(".hamburger").is(":visible");
            }
        };
        
        widget.render();
        that.data("helix", widget);
        
        return widget;
    }
    
    $.fn.helix = function(command, config){
        return init(this, command);
    }
}(jQuery));