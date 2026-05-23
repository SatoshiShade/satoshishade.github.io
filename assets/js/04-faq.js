!function(){
    document.querySelectorAll(".faq-q").forEach(function(btn){
        btn.addEventListener("click",function(){
            var item=btn.closest(".faq-item");
            var ans=item.querySelector(".faq-a");
            var open=btn.getAttribute("aria-expanded")==="true";
            document.querySelectorAll(".faq-item").forEach(function(i){
                i.querySelector(".faq-q").setAttribute("aria-expanded","false");
                i.querySelector(".faq-a").hidden=true;
            });
            if(!open){ btn.setAttribute("aria-expanded","true"); ans.hidden=false; }
        });
    });
}();