
// var urls = [`https://theprint.in/wp-json/wp/v2/posts?per_page=10&context=view`];

// getSingleRSS("http://www.rediff.com/rss/moviesrss.xml").then(data=>populate(data))
// getMultipleRSS(["https://techcrunch.com/feed",`https://www.rt.com/rss/news/`]).then(data=>populate(data))
/*
{"all":"https://inshorts-news.vercel.app/all","automobile":"https://inshorts-news.vercel.app/automobile","business":"https://inshorts-news.vercel.app/business","entertainment":"https://inshorts-news.vercel.app/entertainment","national":"https://inshorts-news.vercel.app/national","politics":"https://inshorts-news.vercel.app/politics","science":"https://inshorts-news.vercel.app/science","sports":"https://inshorts-news.vercel.app/sports","startup":"https://inshorts-news.vercel.app/startup","technology":"https://inshorts-news.vercel.app/technology","world":"https://inshorts-news.vercel.app/world"}
*/
// getInShorts("sports").then(data=>console.log(data));

//url = "http://feeds.feedburner.com/NDTV-LatestNews"
//fetchURL(`https://emm.newsbrief.eu/rss/rss?type=category&id=India&language=en&duplicates=false`).then(data=>console.log(data));
//fetchURL(`https://feedly.com/v3/feeds/feed%2Fhttp%3A%2F%2Ffeeds.feedburner.com%2Fscroll_in.rss?numRecentEntries=5&ck=1656168933640&ct=feedly.desktop&cv=31.0.1621`).then(data=>console.log(data));
// getEMM("events").then(data=>console.log(data));
// getWordpressCOMPosts(["vibeschanger.com"],1)
// getWordpressORGPosts(urls);
//getData([`https://api.gdeltproject.org/api/v2/doc/doc?query=theme:democracy%20sourcelang:eng&mode=artlist&sort=hybridrel&format=json&maxrecords=50&&timespan=24h`]).then(data => populateGDELT(normalizeGDELT(data)));
//getSingleRSS("https://www.youtube.com/feeds/videos.xml?channel_id=UCOQNJjhXwvAScuELTT_i7cQ").then(data=>{updateHTML(data)});
// getMultipleRSS(urls)
//getFeedlyMultiple(urls, 10);
// getFeedlySingle(`http://www.thehindu.com/news/national/?service=rss`,10)
//get_rss("https://www.youtube.com/feeds/videos.xml?channel_id=UCOWcZ6Wicl-1N34H0zZe38w");
//get_rss("https://www.thehindu.com/news/national/?service=rss").then(data=>{console.log(data.items);updateHTML(data.items)});
// getGDELT("sourcelang:eng%20sourcecountry:india",20,"24h","hybridrel").then(data=>populate(data));

//GDELT Block
// getGDELT("theme:ENV_CLIMATECHANGE%20sourcelang:eng",25,"24h","hybridrel").then(data=>populate(data));

// fetchURL("read://https_indianexpress.com/?url=https://indianexpress.com/article/india/parliament-house-cant-be-used-for-dharnas-strikes-rs-secretariat-8030672/")


function getGoogleSearchTrends() {
    return new Promise((resolve, reject) => {
        try {           
            urls = ["https://trends.google.com/trends/api/dailytrends?hl=en-IN&geo=IN&ns=15",
                "https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=US&ns=15",
                "https://trends.google.com/trends/api/dailytrends?hl=en-GB&geo=GB&ns=15",
            ]
            async.mapLimit(urls, 1, async function (url) {
                try {
                    const response = await fetch("https://sbcors.herokuapp.com/" + url)
                    //const response = await fetch(url)
                    return response.text()
                } catch (err) {
                    return ")]}',"
                }
            }, (err, results) => {
                // all = [];
                arr = [];
                results.forEach(item => {
                    arr.push(JSON.parse(item.replace(")]}',", "")))
                })
                // response = 	arr.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title))===i)                
                resolve(arr);
            })          
        } catch (err) { reject(err) }
    })
}
function populateGoogleSearchTrends(data) {
    console.log(data)
    $("#first").html(``);
    var arr = [];
    $.each(data, function (k, v) {
        $.each(v.default.trendingSearchesDays, function (i, j) {
            $.each(j.trendingSearches, function (a, b) {
                arr.push({
                    "title": b.title,
                    "traffic": b.formattedTraffic,
                    "articles": b.articles,
                    "image": b.image.imageUrl,
                    "date": Date.parse(j.formattedDate),
                    "formattedDate": j.formattedDate

                })
            })

        })
    });
    arr = arr.sort(function (a, b) {
        return b.date - a.date;
    });

    $.each(arr, function (k, v) {
        let imgsrc = v.image ? `<img src="${v.image}" alt="" width="72" height="72" class="rounded sqimg d-flex justify-content-start mt-1" onerror='imgError(this)' />` : `<img src="placeholder.jpg" alt="" width="72" height="72" class="rounded sqimg d-flex justify-content-start mt-1" onerror='imgError(this)' />`
        let article0imgsrc = v.articles[0].image ? v.articles[0].image.imageUrl : ``
        var $listItem = $(`
        <li class="mb-2 list-group-item px-2 py-3"> 
                <div class="d-flex gap-2 w-100 justify-content-start">
                    ${imgsrc}
                    <div>  
                        <h6 class="small mb-0 mt-0 fw-bold">${v.title.query}</h6>
                        <p class="mt-0 mb-0 smaller">${v.articles[0].snippet}</p>
                    </div>                  
                </div>  
                <div>
                <details>
                <summary><span class="mt-0 color-main small">Explore</span></summary>
                <ul class="list-group list-group-flush mt-3 ms-3" id="${k}GoogleSearchTrends">
                </ul> 
            </details>   
                </div> 
        </li>`);
        $("#first").append($listItem);
        $.each(v.articles.slice(1), function (a, b) {
            let imgsrc1 = b.image ? b.image.imageUrl : ``
            var $listItem = $(
                `<div class="d-flex gap-2 w-100 justify-content-between mb-2">
                    <details>
                        <summary><span class="small">${b.title}</span></summary>
                        <div class="d-flex gap-2 w-100 justify-content-between mb-2 mt-2">
                            <p class="small fw-bold small">${b.snippet} <span class="text-muted"><a href="${b.url}" target="_blank" style="color:blue;text-decoration:underline">Read full article at ${b.source}</span></p>                                      
                        </div>                                                                           
                    </details>
                </div>`);
            $(`#${k}GoogleSearchTrends`).append($listItem);
        });
    })
}

// Trending Wiki
function getWikiData() {
    return new Promise((resolve, reject) => {
        try { 
            var MyDate = new Date();
            year = MyDate.getFullYear();
            month = ('0' + (MyDate.getMonth() + 1)).slice(-2);
            day = ('0' + (MyDate.getDate())).slice(-2);
            let url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;
            urls = [url]
            async.mapLimit(urls, 1, async function (url) {
                try {
                    const response = await fetch(url)
                    return response.json()
                } catch (err) {
                    return {}
                }

            }, (err, results) => {
                if (err) { console.log(err); } else {
                    wiki = {}
                    arr = []
                    $.each(results[0].mostread.articles, function (k, v) {
                        arr.push({ title: v.displaytitle, thumbnail: v.thumbnail, extract: v.extract, description: v.description, views: v.views, link: v.content_urls.desktop.page });
                    });
                    wiki.mostread = arr;
                    otd = []
                    $.each(results[0].onthisday, function (k, v) {
                        pages = []
                        $.each(v.pages, function (i, j) {
                            let thumbnail = j.thumbnail ? j.thumbnail.source : ``
                            pages.push({
                                title: j.displaytitle,
                                thumbnail: thumbnail,
                                extract: j.extract,
                                description: j.description,
                                link: j.content_urls.desktop.page
                            })
                        });
                        otd.push({
                            title: v.text,
                            year: v.year,
                            pages: pages
                        });
                    });
                    wiki.otd = otd;
                    wiki.image = {
                        "thumbnail": results[0].image.thumbnail.source,
                        "artist": results[0].image.artist.text,
                        "description": results[0].image.description.text,
                    }
                    var thumbnail = results[0].tfa.thumbnail ? results[0].tfa.thumbnail.source : ``
                    wiki.tfa = {
                        "title": results[0].tfa.displaytitle,
                        "thumbnail": thumbnail,
                        "content": results[0].tfa.extract,
                        "description": results[0].tfa.description.text,
                        "link": results[0].tfa.content_urls.desktop.page,
                    }                   
                    resolve(wiki)
                }

            })
           
        } catch (err) { reject(err) }
    })
}
function populateWiki(data) {
    $("#first").html(``);
    $("#first").append(`
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="mostread-tab" data-bs-toggle="tab" data-bs-target="#mostread" type="button" role="tab" aria-controls="mostread" aria-selected="true">Most Read</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="featured-tab" data-bs-toggle="tab" data-bs-target="#featured" type="button" role="tab" aria-controls="featured" aria-selected="false">Featured</button>
        </li>     
        <li class="nav-item" role="presentation">
        <button class="nav-link" id="otd-tab" data-bs-toggle="tab" data-bs-target="#otd" type="button" role="tab" aria-controls="otd" aria-selected="false">OTD</button>
    </li>   
    </ul>
    <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="mostread" role="tabpanel" aria-labelledby="mostread-tab"></div>
        <div class="tab-pane fade" id="featured" role="tabpanel" aria-labelledby="featured-tab"></div> 
        <div class="tab-pane fade" id="otd" role="tabpanel" aria-labelledby="otd-tab"></div>       
    </div>
    `);
    var mostread = data.mostread
    $.each(mostread, function (k, v) {        
        let imgsrc = v.thumbnail ? `<img src="${v.thumbnail.source}" alt="" width="56" height="56" class="rounded sqimg d-flex justify-content-start mt-1" onerror='imgError(this)' />` : `<img src="placeholder.jpg" alt="" width="72" height="72" class="rounded sqimg d-flex justify-content-start mt-1" onerror='imgError(this)' />`

        var $listItem = $(`                    
        <li class="list-group-item p-2 mb-2" >                                        
            <div class="d-flex gap-2 w-100 justify-content-start">
                ${imgsrc}
                <div>
                    <p class="mb-0 mt-1 small">Views: ${v.views.toLocaleString("en-GB")}</p>
                    <p class="mb-0 mt-0 fw-bold small">${v.title} <span class="small">(${v.description})</span></p>
                </div>
            </div>
            <div>
                <details>
                    <summary><span class="smaller">Read more about ${v.title}</span></summary>
                    <p class="mb-0 mt-1 small">${v.extract}</p>
                    <p class="mb-0 mt-1 small"><a href="${v.link}" target="_blank">Read full article on Wikipedia</a></p>
                </details>
            </div>
        </li>
        `);
        $("#mostread").append($listItem);
    });
    var image = data.image
    let imgsrc = image.thumbnail ? image.thumbnail : ``
    var $listItem = $(`                    
                    <li class="list-group-item  mt-4 mb-1">   
                        <div class="card" style="width:100%;">                            
                            <div class="card-body">
                                <p class="mt-0 fw-bold">${image.description}</p> 
                                <p class="mt-1 mb-0 small fw-bold">Artist: ${image.artist}</p>
                            </div>
                            <img src="${imgsrc}" class="card-img-top" alt="" onerror='imgError(this)' />                                   
                            </div>                            
                        </div>
                    </li>
                    `);
    $("#featured").append($listItem);
    var tfa = data.tfa
    let taimgsrc = tfa.thumbnail ? tfa.thumbnail : ``
    var $listItem = $(`                    
                    <li class="list-group-item mb-1">   
                        <div class="card mt-4" style="width:100%;">  
                            <div class="card-body"> 
                                <h5 class="mt-0 fw-bold">${tfa.title}</h5> 
                                <p class="mt-1 mb-0 small fw-bold">${tfa.content}</p>
                            </div> 
                            <img src="${taimgsrc}" class="card-img-top" alt="" onerror='imgError(this)' />
                            </div>
                        </div>
                    </li>
                    `);
    $("#featured").append($listItem);


    $.each(data.otd, function (k, v) {
        var details = ""
        $.each(v.pages, function (i, j) {
            details += `<div class="d-flex gap-2 w-100 justify-content-between my-1">
            <div>
                <details class="ms-4" style="cursor:pointer"><summary class="mb-0 mt-0">${j.title} (<small>${j.description}</small>)                          
                </summary>
                <p class="mb-0 mt-0 small">${j.extract}</p>  
                <p class="mb-0 mt-0 small"><a href="${j.link}" target="_blank">Read full article on Wikipedia</a></p>   
                </details>                                                        
            </div>           
        </div>`
        });
        var $listItem = $(`                    
        <li class="list-group-item p-2 mb-2" >                                        
            <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                    <p class="mb-0 mt-1">${v.year}</p> 
                    <details class="top-details" style="cursor:pointer"><summary class="mb-0 mt-0 fw-bold">${v.title}             
                    </summary>
                        ${details}
                    </details>                                                        
                </div>
               
            </div>	
           
        </li>
        `);
        $("#otd").append($listItem);
    });
}

// Realtime Trends
function getRealTimeTrends(){
    return new Promise((resolve, reject)=>{
        try            
           {           
            if(getCountry() && getLanguage()){
                param = `hl=${getLanguage()}-${getCountry()}&tz=0&fi=0&fs=0&geo=${getCountry()}&ri=300&rs=20&sort=0`
                urls = [
                    `https://trends.google.com/trends/api/realtimetrends?${param}&cat=h`,
                    `https://trends.google.com/trends/api/realtimetrends?${param}&cat=e`,
                    `https://trends.google.com/trends/api/realtimetrends?${param}&cat=t`,
                    `https://trends.google.com/trends/api/realtimetrends?${param}&cat=b`,
                    `https://trends.google.com/trends/api/realtimetrends?${param}&cat=s`,
                    `https://trends.google.com/trends/api/realtimetrends?${param}&cat=m`,
                ]
            } else{
                urls = [
                    "https://trends.google.com/trends/api/realtimetrends?cat=h",
                    "https://trends.google.com/trends/api/realtimetrends?cat=e",
                    "https://trends.google.com/trends/api/realtimetrends?cat=t",
                    "https://trends.google.com/trends/api/realtimetrends?cat=b",
                    "https://trends.google.com/trends/api/realtimetrends?cat=s",
                    "https://trends.google.com/trends/api/realtimetrends?cat=m",
                ]
            }
            async.mapLimit(urls, 6, async function (url) {
                try {
                    const response = await fetch("https://sbcors.herokuapp.com/" + url)
                    return response.text()
                } catch (err) {
                    return "{)]}'}"
                }

            }, (err, results) => {
                if (err) {console.log(err);}
                else{
                    // all = [];
                    arr = [];
                    articles = []
                    for(index in results){
                        try{
                            if(results[index]){
                                response = JSON.parse(results[index].replace(")]}'", ""));
                                response.storySummaries.trendingStories.forEach(item => {arr.push(item)});
                            }
                        }catch (err){
                            console.trace(err);
                        }
                    }
                    response = 	arr.filter((v,i,a)=>a.findIndex(t=>(t.title === v.title))===i)                    
                    resolve(response);
                };
            })
        }catch(err){reject(err)}
    })
}
function populateRealTimeTrends(data) {    
    $("#first").html(``);
    $.each(data, function (k, v) {
        let imgsrc = v.image.imgUrl ? `<img src="http:${v.image.imgUrl}" alt="" width="56" height="56" class="rounded sqimg d-flex justify-content-end" onerror='imgError(this)' />` : ``
        var $listItem = $(`
        <li class="list-group-item py-4 mb-0" style="cursor:pointer"> 
                <div class="d-flex gap-2 w-100 justify-content-start">
                    ${imgsrc}
                    <div>    
                        <h6 class="small mb-0 mt-0 fw-bold">${v.title}</h6>
                    </div>
                </div> 
                <div>
                    <details>
                        <summary class="text-main">Explore</summary>
                        <ul class="list-group list-group-flush mt-3 ms-3" id="${k}googleTrends">
                        </ul> 
                    </details>
                </div>  
        </li>`);
        $("#first").append($listItem);
        $.each(v.articles, function (a, b) {
            var $listItem = $(
                `<div class="d-flex gap-2 w-100 justify-content-between mb-2">
                            <details>
                                <summary><span class="">${b.articleTitle}</span></summary>
                                <div class="d-flex gap-2 w-100 justify-content-between mb-2 mt-2">
                                    <p class="small fw-bold">${b.snippet} <span class="text-muted"><a href="${b.url}" target="_blank" style="color:blue;text-decoration:underline">Read full article at ${b.source}</span></p>                                      
                                </div>                                                                           
                             </details> 
                            </div>`);
            $(`#${k}googleTrends`).append($listItem);
        });
    })
}


function imgError(image) {
    //  $(image).hide();    
    $(image).attr("src", `placeholder.jpg`);
    // $(image).unwrap();
    //$(image).parent().remove();
}

getGDELT('sourcelang:eng%20sourcecountry:india',250,'6h','datedesc').then(data=>populate(data));






