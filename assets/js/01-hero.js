!function(){var e=document.getElementById("typing-line");if(!e)return;var c=document.createElement("span");c.className="cursor";c.setAttribute("aria-hidden","true");e.parentNode.appendChild(c);e.textContent="";
var s=[

"alex.mytag.sol",
"sarah.mystory.sol",
"luna.fames.sol",
"nova.artistlink.sol",
"pro.gametag.sol",
"vip.ogclub.sol",
"jake.ogwallet.sol",
"tim.bonktag.sol",
"ai.aicreator.sol",
"launch.startuphub.sol",
"project.daolink.sol"

];
var si=0,ci=0,del=false;function show(t){if(!t){e.innerHTML="\u200c";return;}var d=t.indexOf(".");d<0?e.innerHTML=t:e.innerHTML=t.slice(0,d+1)+'<span class="highlight-sol">'+t.slice(d+1)+"</span>";}function tick(){var p=s[si],spd;if(del){ci--;if(ci<=0){ci=0;show("");del=false;si=(si+1)%s.length;setTimeout(tick,900);return;}show(p.slice(0,ci));spd=42;}else{show(p.slice(0,ci+1));ci++;if(ci===p.length){setTimeout(function(){del=true;tick();},2400);return;}spd=ci<4?270:120;}setTimeout(tick,spd+Math.random()*30-10);}tick();}();
