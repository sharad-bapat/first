const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const latitude = urlParams.get('latitude');
const longitude = urlParams.get('longitude');
console.log(latitude, longitude);
var country = "";
var language = "";

getCountry();
function getCountry() {
    country = navigator.languages[0].split("-")[1]
    language = navigator.languages[0].split("-")[0]
    if(!language){
        language = "en";   
    }
    if(!country){
        country = "IN";
    }
    console.log(`Country:${country}, Language: ${language}`);
}

// Helper Functions
function skeleton(){
    return new Promise((resolve, reject)=>{
        try{
            if(!getLocalStorage("")){


            }else{
                resolve(getLocalStorage(""));
            }
        }catch(err){reject(err)}
    })
}
function groupBy(xs, f) {
    return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}
//get_rss("https://www.thehindu.com/news/national/?service=rss").then(data=>{console.log(data.items);updateHTML(data.items)});
//getGDELT("sourcelang:eng%20sourcecountry:india").then(data=>populateGDELT(data));

//GDELT Block
function normalizeGDELT(results){
    arr = []
    for (index in results) {
        if (results[index].articles) {
            results[index].articles.forEach(item => {
                var item_index = arr.findIndex(x => x.link == item.url);
                if (item_index === -1) {
                    var mDate = item.seendate.slice(0, 4) + "-" + item.seendate.slice(4, 6) + "-" + item.seendate.slice(6, 8)
                        + " " + item.seendate.slice(9, 11) + ":" + item.seendate.slice(11, 13)
                        + ":" + item.seendate.slice(13, 15);
                    var unixtime = Date.parse(mDate);
                    arr.push({ "title": item.title.replaceAll(" - ", "-").replaceAll(" %", "%").replaceAll(" .", "."), "created": unixtime, "link": item.url, "source": item.domain, "thumbnail": item.socialimage })
                }
            });
        }
    }
    arrr = arr.sort(function (a, b) {
        return b.created - a.created;
    });
    return arrr
}
function getGDELT(query) {
    return new Promise((resolve, reject) => {
        try {
            urls = [`https://api.gdeltproject.org/api/v2/doc/doc?mode=artlist&sort=hybridrel&format=json&maxrecords=50&query=${query}&timespan=1h`]
            async.mapLimit(urls, 11, async function (url) { try { const response = await fetch(url); return response.json() } catch (err) { return {} } }, (err, results) => { response = normalizeGDELT(results); resolve(response) })
        } catch (err) { reject(err) }
    })
}

function populateGDELT(data){
    $("#first").html("");
    $.each(data, function(k,v){
        var $listItem = $(`                    
        <li class="px-2 py-3 list-group-item newslink" style="cursor:pointer">
        <div class="d-flex justify-content-start">
                    <img src="${v.thumbnail}" alt="" height="64" width="64" class="rounded mt-2">
                    <div class="ms-2">  
                        <p class="mb-0 smallest">${v.source}</p>
                        <h6 class="fw-bold mb-0 mt-0">${v.title}</h6>                        
                    </div>                  
        </div>  
        <div class="container mt-3">
        <div class="row justify-content-end">
        <div class="col-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
        </svg>
        </div>
        <div class="col-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </div>
        
        <div class="col-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
        </svg>
        </div>
        <div class="col-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
  <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
</svg>
</div>
       
        
         
        </div>
        </div>
       
        </li>
        `);
        $("#first").append($listItem);
        $listItem.on("click", function (e) {
            console.log(v.link);
            getArticleExtract(v.link);
        });
    })
   
}
function on(url) {
    getArticleExtract(url);
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

function getArticleExtract(url) {
    $("#wpContent").html(``);
    async.tryEach([
        (next) => {
            Parse(`${url}`).then(data => {
                if (data.title) {
                    console.log(data);
                    source_url = new URL(url);
                    update_HTML(data, source_url);
                } else {
                    console.log(`Simple parsing did not work`);
                    return next(new Error('Cannot get Data'))
                }
            }).catch(err => {
                console.log(err);
                document.getElementById("overlay").style.display = "none";
                return next(new Error('Cannot get Data'))
            })
        },

        (next) => {
            Parse(`https://sbcors.herokuapp.com/${url}`).then(data => {
                if (data.title) {
                    console.log(data);
                    source_url = new URL(url);
                    update_HTML(data, source_url);

                } else {
                    console.log(`CORS did not work`);
                    document.getElementById("overlay").style.display = "none";
                    return next(new Error('Cannot get Data'))
                }
            }).catch(err => {
                console.log(err);
                document.getElementById("overlay").style.display = "none";
                return next(new Error('Cannot get Data'))
            })
        },
    ])


}

function update_HTML(data, source_url) {
    document.getElementById("overlay").style.display = "block";
    $("#wpContent").append(`<div class="mb-2 ms-0 d-flex"><a href="#" onclick="off()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg text-dark fw-bold" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg></a></div>`);
    $("#wpContent").append(`<img alt="${source_url.hostname}" class="mt-1 mb-3" src="https://www.google.com/s2/favicons?domain=${source_url.hostname}" /><span class="small"> ${source_url.hostname.replace("http://", "").replace("https://", "").replace("www.", "")}</span>`);
    $("#wpContent").append(`<h1>${data.title}</h1>`);
    if (data.date_published) {
        $("#wpContent").append(`<p class="small m-2">${data.date_published.split('T')[0]}</p>`);
    }
    $("#wpContent").append(`<hr class="my-3"></hr>`);
    //$("#wpContent").append(`<img src ="${data.lead_image_url}" alt="" width='80%' height="auto" style="object-fit:cover; margin:auto" onerror='imgError(this)'/>`);
    $("#wpContent").append(`<p class="small">${data.content}<p>`);
    $("#wpContent").append(`<div class="mb-2 ms-0 d-flex"><a href="#" onclick="off()"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-x-lg text-dark fw-bold" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg></a></div>`);
    $("#loader").attr("style", "display:none");
    $("#wpContent").show();


}

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
  
    if (interval > 1) {
      return interval + " years";
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

//let aDay = '2022-07-11T06:44:25.000Z'
//console.log(timeSince(new Date(aDay)));


