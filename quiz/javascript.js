'use strict';
var L = document.querySelectorAll('.question > li');
var N = document.querySelectorAll('.sidebar > div > a');
var y1 = 0;
var y2 = 0;
var check = 0;
window.addEventListener('scroll', (event) => {
    var H = window.innerHeight;
    for (var i = 0; i < L.length; i++){
        y1 = L[i].getBoundingClientRect().top;
        y2 = L[i].getBoundingClientRect().bottom;
        check = (y1>0 & y1<H) | (y1<0 & y2>H)
        if(check){
            N[i].style.backgroundColor = 'red';
        }else{
            N[i].style.backgroundColor = 'black';
        }
    }
});
