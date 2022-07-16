//let aDay = '2022-07-11T06:44:25.000Z'
//console.log(timeSince(new Date(aDay)));
function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);  
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";

}

//Groups an array by a specific element
function groupBy(xs, f) {
    return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}

//Skelton for returning a promise with local storage
function skeleton_storage(){
    return new Promise((resolve, reject)=>{
        try{
            if(!getLocalStorage("")){


            }else{
                resolve(getLocalStorage(""));
            }
        }catch(err){reject(err)}
    })
}

//Skelton for returning a promise without local storage
function skeleton(){
    return new Promise((resolve, reject)=>{
        try{
            
        }catch(err){reject(err)}
    })
}

//Get Country and Language from Browser
function getCountry() {
    var country = navigator.languages[0].split("-")[1]    
    if(!country){
        country = "IN";
    }     
    return country;
}
function getLanguage() {    
    var language = navigator.languages[0].split("-")[0]
    if(!language){
        language = "en";   
    }  
    return language;
}

//wrapper around fetch for text and json response
async function fetchURL(url) {
    const response = await fetch(url);
    const text = await response.text();
    try {
        const data = JSON.parse(text);
        return { success: 1, urlfetched: url, data: data }
    } catch (err) {
        return { success: 0, urlfetched: url, error: err, response: text }
    }
}

//URL Params
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const latitude = urlParams.get('latitude');
// const longitude = urlParams.get('longitude');


//Scroll to top of Page
// var mybutton = document.getElementById("gotop");
// document.body.onscroll = function() {scrollFunction()};
// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     mybutton.style.display = "block";   
//   } else {
//     mybutton.style.display = "none";
//   }
// }
// // When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//   // document.getElementById('mainContent').scrollTop = 0;
//   document.body.scrollTop = 0;
//   document.documentElement.scrollTop = 0;
// }

//Scroll to top of Div with class .scroll
//a button element with id gotop becomes visible
$(".scroll").scroll(function () {
    var mybutton = document.getElementById("gotop");
    if ($(".scroll")[0].scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
});
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    $(".scroll").animate({ scrollTop: 0 }, "fast");
}