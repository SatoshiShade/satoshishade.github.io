!function(){
    var ctrl=document.getElementById("browser-controls");
    if(ctrl) ctrl.style.display="flex";

    var grid=document.getElementById("browser-grid");
    if(!grid) return;
    var cards=Array.from(grid.querySelectorAll(".bc"));
    var searchEl=document.getElementById("domain-search");
    var clearBtn=document.getElementById("search-clear");
    var emptyEl=document.getElementById("browser-empty");
    var filterBtns=document.querySelectorAll(".filter-pill");
    var moreWrap=document.getElementById("browser-more-wrap");
    var moreBtn=document.getElementById("browser-more-btn");
    var lessBtn=document.getElementById("browser-less-btn");

    var activeFilter="all";
    var searchVal="";
    var INITIAL_LIMIT=6;
    var showAll=false;

    function update(){
        var matched=[];
        cards.forEach(function(c){
            var catOk=activeFilter==="all"||c.dataset.cat===activeFilter;
            var q=searchVal.toLowerCase().replace(/\.sol$/,"");
            var nameOk=!q||c.dataset.name.indexOf(q)>-1||c.dataset.cat.indexOf(q)>-1;
            if(catOk&&nameOk) matched.push(c);
        });

        var limited=!showAll&&matched.length>INITIAL_LIMIT;
        var toShow=limited?matched.slice(0,INITIAL_LIMIT):matched;

        cards.forEach(function(c){ c.classList.add("bc-hidden"); });
        toShow.forEach(function(c){ c.classList.remove("bc-hidden"); });

        /* Show More / Show Less buttons */
        if(moreWrap){
            var needButtons=matched.length>INITIAL_LIMIT;
            moreWrap.style.display=needButtons?"flex":"none";
            if(moreBtn) moreBtn.style.display=limited?"inline-flex":"none";
            if(lessBtn) lessBtn.style.display=(!limited&&needButtons)?"inline-flex":"none";
            if(moreBtn&&limited) moreBtn.textContent="Show "+(matched.length-INITIAL_LIMIT)+" More";
        }

        if(emptyEl) emptyEl.hidden=matched.length>0;
    }

    filterBtns.forEach(function(btn){
        btn.addEventListener("click",function(){
            filterBtns.forEach(function(b){ b.classList.remove("active"); });
            btn.classList.add("active");
            activeFilter=btn.dataset.filter;
            showAll=false;
            update();
        });
    });

    if(searchEl){
        searchEl.addEventListener("input",function(){
            searchVal=searchEl.value;
            if(clearBtn) clearBtn.hidden=!searchVal;
            showAll=false;
            update();
        });
    }

    if(clearBtn){
        clearBtn.addEventListener("click",function(){
            if(searchEl) searchEl.value="";
            searchVal=""; clearBtn.hidden=true;
            showAll=false; update();
            if(searchEl) searchEl.focus();
        });
    }

    if(moreBtn){
        moreBtn.addEventListener("click",function(){
            showAll=true;
            update();
        });
    }

    if(lessBtn){
        lessBtn.addEventListener("click",function(){
            showAll=false;
            update();
            /* Scroll back up to the browser section header smoothly */
            var sec=document.querySelector(".browser-section");
            if(sec) sec.scrollIntoView({behavior:"smooth",block:"start"});
        });
    }

    update();
}();