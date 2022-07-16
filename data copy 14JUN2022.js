const CORS_PROXY = "http://sbcors.herokuapp.com/";

//RSS
function normalizeRSS(data){
    var arr=[], arrr=[];
    $.each(data, function(i,j){
        $.each(j.items, function(k,v){                   
            let media = v.media ?  v.media : ``;
            let iDate = v.isoDate ? ` | ${timeSince(new Date(v.isoDate))}` : ``
            let published =  Date.parse(v.isoDate);
            let title =  v.title ? v.title : ``
            let content =  v.content ? v.content : ``
            arr.push({
                "title": title,
                "link": v.link,
                "content": content,
                "iDate": iDate,
                "media": media,
                "published":published,
            })
        });
        arrr = arr.sort(function (a, b) {
            return b.published - a.published;
        });       
    })
    return arrr;  
     
}
function getSingleRSS(url) {
    return new Promise((resolve, reject) => {
        try {           
            let parser = new RSSParser();           
            arr = [];
            parser.parseURL(CORS_PROXY + url, function (err, feed) {
                //console.log(feed);
                $.each(feed.items, function(k,v){                   
                    let media = v.media ?  v.media : ``;
                    let iDate = v.isoDate ? ` | ${timeSince(new Date(v.isoDate))}` : ``
                    let published =  Date.parse(v.isoDate);
                    let title =  v.title ? v.title : ``
                    let content =  v.content ? v.content : ``
                    arr.push({
                        "title": title,
                        "link": v.link,
                        "content": content,
                        "iDate": iDate,
                        "media": media,
                        "published":published,
                    })
                });
                var arrr = arr.sort(function (a, b) {
                    return b.published - a.published;
                });
               console.log(arrr)
               resolve(arrr)
            })
        } catch (err) { reject(err) }
    })

}
function getMultipleRSS(urls){
    return new Promise((resolve, reject)=>{
        try{
            let parser = new RSSParser(); 
            async.map(urls, async function (url) {
                try {
                    const response =  await parser.parseURL(CORS_PROXY + url)
                    return response                 
                } catch (err) {
                    return {"err":err}
                }

            }, (err, results) => {
                if (err) { console.log(err); } else {                   
                    console.log(normalizeRSS(results));
                    resolve(results)
                }
            })
            
        }catch(err){reject(err)}
    })
}

//GDELT
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
                    arr.push({ 
                        "title": item.title.replaceAll(" - ", "-").replaceAll(" %", "%").replaceAll(" .", "."),
                        "created": unixtime, 
                        "link": item.url, 
                        "source": item.domain, 
                        "thumbnail": item.socialimage 
                    })
                }
            });
        }
    }
    arrr = arr.sort(function (a, b) {
        return b.created - a.created;
    });
    return arrr
}
function getGDELT(query,maxrecords,timespan,sort) {
    return new Promise((resolve, reject) => {
        try {
            urls = [`https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&sort=${sort}&format=json&maxrecords=${maxrecords}&&timespan=${timespan}`]
            async.map(urls, async function (url) {
                try {
                    const response = await fetch(url);
                    return response.json()
                } catch (err) {
                    return {}
                }
            }, (err, results) => {
                response = normalizeGDELT(results);
                resolve(response)
            })
        } catch (err) { reject(err) }
    })
}

//Reddit
function normalizeRedditData(results){
    arr = []
    for (index in results) {
        results[index].data.children.forEach(item => {
            var item_index = arr.findIndex(x => x.link == item.data.url);
            if (item.data.url.includes("youtube") || item.data.url.includes("youtu.be") || item.data.url.includes("twitter.com") || item.data.url.includes("redd.it") || item.data.url.includes("reddit.com") || item.data.url.includes("imgur.com") || item.data.url.includes("gfycat.com")) {
                //do nothing
            } else {
                if (item_index === -1) {
                    arr.push({
                        "title": item.data.title,
                        "created": item.data.created,
                        "link": item.data.url,
                        "source": item.data.domain,
                        "thumbnail": item.data.thumbnail,
                    })
                }
            }
        });
    }
    arrr = arr.sort(function (a, b) {
        return b.created - a.created;
    });
    return arrr;
}
function getReddit(subreddits) {
    return new Promise((resolve, reject) => {
        try {
            urls = [
                `https://www.reddit.com/r/${subreddits}/top/.json?t=week&limit=50`,
                `https://www.reddit.com/r/${subreddits}/top/.json?t=day&limit=50`,
                `https://www.reddit.com/r/${subreddits}/top/.json?t=hour&limit=50`,
                `https://www.reddit.com/r/${subreddits}/hot/.json?&t=week&limit=50`,
                `https://www.reddit.com/r/${subreddits}/hot/.json?&t=day&limit=50`,
                `https://www.reddit.com/r/${subreddits}/hot/.json?&t=hour&limit=50`,
            ]
            async.mapLimit(urls, 6, async function (url) { 
                try { 
                    const response = await fetch(url); 
                    return response.json() 
                } catch (err) { 
                    return {} 
                } 
            }, (err, results) => { 
                response = normalizeRedditData(results);                     
                resolve(response) 
            })
        } catch (err) { reject(err) }
    })
}

//Feedly
function normalizeFeedly(data){
    var arr=[];
    var arrr = [];
    if(Array.isArray(data)){
        for (index in data) {
            //console.log(results[index].title)
            if (data[index].recentEntries) {
                data[index].recentEntries.forEach(item => {
                    let title = item.title ? item.title : ``;
                    let link = item.canonicalUrl ? item.canonicalUrl : ``;
                    let content = item.summary ? item.summary.content : ``
                    let published = item.published ? item.published : ``
                    let media = item.visual ? item.visual.url : ``
                    arr.push({
                        "title": title,
                        "link": link,
                        "content": content,
                        "published": published,
                        "media": media
                    })
                });
            }
            arrr = arr.sort(function (a, b) {
                return b.published - a.published;
            });
        }
    }
    else{
        data.data.recentEntries.forEach(item => {
            let title = item.title ? item.title : ``;
            let link = item.canonicalUrl ? item.canonicalUrl : ``;
            let content = item.summary ? item.summary.content : ``
            let published = item.published ? item.published : ``
            let media = item.visual ? item.visual.url : ``
            arr.push({
                "title": title,
                "link": link,
                "content": content,
                "published": published,
                "media": media
            });
            arrr = arr.sort(function (a, b) {
                return b.published - a.published;
            });
        });
    }
    return arrr;
}
function getFeedlySingle(url, n){    
    return new Promise((resolve, reject) => {
        try {
            url =  `https://feedly.com/v3/feeds/feed%2F${encodeURIComponent(url)}?numRecentEntries=${n}&ck=1656168883401&ct=feedly.desktop&cv=31.0.1621`;                        
            fetchURL(CORS_PROXY + url).then(data=>{
                console.log(data);
                console.log(normalizeFeedly(data));;
                resolve(data);
            })
        } catch (err) { reject(err) }
    })
}
function getFeedlyMultiple(urls,n){    
    return new Promise((resolve, reject) => {
        try {           
            async.map(urls, async function (url) {
                try {
                    url =  `https://feedly.com/v3/feeds/feed%2F${encodeURIComponent(url)}?numRecentEntries=${n}&ck=1656168883401&ct=feedly.desktop&cv=31.0.1621`
                    const response = await fetch(CORS_PROXY + url)
                    return response.json()
                } catch (err) {
                    return {}
                }

            }, (err, results) => {
                if (err) { console.log(err); } else {                   
                    resolve(normalizeFeedly(results));
                }
            })
        } catch (err) { reject(err) }
    })
}

//Wordpress.ORG
function normalizeWordpressORG(data){
    var arr=[];
    var arrr=[];
    for (index in data) {
        data[index].forEach(item => {
            arr.push({
                "title": item.title.rendered,
                "content": item.content.rendered,
                "excerpt": item.excerpt.rendered,
                "link": item.link,
                "date": item.date,
                "thumbnail": item.jetpack_featured_media_url,
                "created": Date.parse(item.date),
            })
        });
    }
    arrr = arr.sort(function (a, b) {
        return b.created - a.created;
    });
    return arrr;
}
function getWordpressORGPosts(urls,numArticle) {  
    return new Promise((resolve, reject)=>{
        try{
            async.map(urls, async function (url) {        
                try {
                    url =  `${url}/wp-json/wp/v2/posts?per_page=${numArticle}&context=view`;            
                    const response = await fetch(url,{mode:"no-cors"})
                    return response.json()
                } catch (err) {
                    console.log(err);
                }
        
            }, (err, results) => {
                if (err) { 
                    async.map(urls, async function (url) {        
                        try {
                            url =  `${url}/wp-json/wp/v2/posts?per_page=${numArticle}&context=view`;            
                            const response = await fetch(CORS_PROXY + url,{mode:"no-cors"})
                            return response.json()
                        } catch (err) {
                            console.log(err);
                        }
                
                    }, (err, results) => {
                        if (err) { 
                            console.log(err)
                        }else{
                            console.log(results);
                            console.log(normalizeWordpressORG(results));
                            resolve(normalizeWordpressORG(results));   
                        }
                           
                    })
                }
                else if (results){
                    console.log(results);
                    console.log(normalizeWordpressORG(results));
                    resolve(normalizeWordpressORG(results));        
                }
               
            })
        }catch(err){reject(err)}
    }) 
   
}

//Wordpress.COM
function normalizeWordpressCOM(data){
    var arr=[];
    var arrr=[];
    $.each(data,function(i,j){
        if(j.code==200){
            $.each(j.body.posts,function(k,item){
                arr.push({
                    "title": item.title,
                    "content": item.content,
                    "excerpt": item.excerpt,
                    "link": item.URL,
                    "date": item.date,
                    "thumbnail": item.featured_image,
                    "created": Date.parse(item.date),
                })
            })
        }
    });
    arrr = arr.sort(function (a, b) {
        return b.created - a.created;
    });
    return arrr;
}
function getWordpressCOMPosts(urls,n) {
    return new Promise((resolve, reject)=>{
        try{
            async.map(urls, async function (url) {        
                try {
                    console.log(url);
                    url =  `https://public-api.wordpress.com/rest/v1.2/sites/${url}/posts?http_envelope=1&number=${n}`;            
                    console.log(url);
                    const response = await fetch(CORS_PROXY + url)
                    return response.json()
                } catch (err) {
                    console.log(err);
                }
        
            }, (err, results) => {
                if (err) { console.log(err); }
                console.log(normalizeWordpressCOM(results));
                resolve(normalizeWordpressCOM(results));        
            })
        }catch(err){reject(err)}
    }) 
}

//EMM NewsBrief
function normalizeEMM(data){
    var arr=[],arrr=[];
    $.each(data.data.items,function(k,item){
        arr.push({
            "title": item.title,
            "content": "",
            "excerpt": item.description,
            "link": item.mainItemLink,
            "date": item.startDate,
            "thumbnail": "",
            "created": Date.parse(item.pubDate),
        })
    });
    arrr = arr.sort(function (a, b) {
        return b.created - a.created;
    });
    return arrr;
}
function getEMM(stories){
    return new Promise((resolve, reject)=>{
        try{
            url =  `https://emm.newsbrief.eu/emmMap/tunnel?sid=emmMap&?stories=${stories}&language=en`;                        
            fetchURL(CORS_PROXY + url).then(data=>{
                console.log(data);
                console.log(normalizeEMM(data));;
                resolve(data);
            })
        }catch(err){reject(err)}
    })
}

//Generic Async
function getData(urls) {    
    return new Promise((resolve, reject) => {
        try {           
            async.map(urls, async function (url) {
                try {
                    const response = await fetch(url)
                    return response.json()
                } catch (err) {
                    return {}
                }

            }, (err, results) => {
                if (err) { console.log(err); } else {                   
                    resolve(results);
                }
            })
        } catch (err) { reject(err) }
    })
}

//To-DO
//check if a website loads without cors, if not use proxy to load it.
async function fetchURL(url) {
    try {        
        const response = await fetch(url, { mode: "no-cors" })
        return response.json()
    } catch (err) {
        try {        
            const response = await fetch(CORS_PROXY + url)
            return response.json()
        } catch (err) {
            console.log(err);
        }
    }
}