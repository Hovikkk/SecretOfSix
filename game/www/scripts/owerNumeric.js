(function ($) {

    $.fn.initNumeric = function (ul,start,end,currect,changeHandler) {
        var index = currect - start + 1;
        var count = end - currect+1
        var dragIsActive = false;
        var poxY;
        $(this).empty();

        for (var i = start; i <= end; i++) {
            $(this).append("<li>"+i+"</li>")
        }

        $("li", ul).on("touchstart", function (e) {
            dragIsActive = true;
            poxY = e.originalEvent.touches[0].pageY;
            update();
            $("ion-content").unbind("touchend").bind("touchend", function (e) {
                dragIsActive = false;
                $("ion-content").unbind()
                changeHandler(index + start - 1);
                update();
            });
            $("ion-content").unbind("touchmove").bind("touchmove", function (e) {
                dragIsActive = true;
                if (poxY - e.originalEvent.touches[0].pageY >= 50) {
                    index++
                    if (index > end - 1) {
                        index = end - 1;
                    }
                    poxY = e.originalEvent.touches[0].pageY;
                }
                if (poxY - e.originalEvent.touches[0].pageY <= -50) {
                    index--;
                    if (index < 1) {
                        index = 1;
                    }
                    poxY = e.originalEvent.touches[0].pageY;
                }
                update();
            });
        });
        


        update();
        function update() {
            $("li", ul).attr("class", "hide_numirical");
            
            if (dragIsActive) {
                console.log(index);
                var prv = index - 1;
                
                if (prv > 0) {
                    $("li:nth-child(" + prv + ")", ul).addClass("prv_numerical");
                }
                var next = index + 1;
               
                if (next <= end) {
                    $("li:nth-child(" + next + ")", ul).addClass("next_numerical");
                }
                console.log(prv,index,next,count,start,end)

            }

            $("li:nth-child(" + index + ")", ul).addClass("active_numerical");
            
        }
    };
})(jQuery);