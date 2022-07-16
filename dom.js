function updateSearchRSSHTML(data){
    $.each(data.items, function(k,v){
        var $listItem = $(`
        <li class="px-2 py-3 list-group-item newslink" style="cursor:pointer">
                <div class="d-flex justify-content-start">                    
                    <div class="ms-2">
                        <p class="mb-0 smallest">${v.pubDate}</p>
                        <h6 class="fw-bold mb-0 mt-0">${v.title}</h6>
                        <p class="mt-3" style="white-space: pre-line">${v.content}</p>
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

function updateHTML(data) {
    $.each(data, function (k, v) {
        var {hostname} = v.link ? new URL(v.link) : new URL("https://www.google.com")
        let media = v.media ? `<img src="${v.media}" alt="" height="64" width="64" style="object-fit:cover">` : `<img src="https://icon.horse/icon/${hostname.replace("www.", "")}" alt="" height="64" width="64" style="object-fit:cover">`;
        let iDate = v.isoDate ? ` | ${timeSince(new Date(v.isoDate))}` : ``
        let title =  v.title ? v.title : ``
        let content =  v.content ? v.content : ``
        var $listItem = $(`
        <li class="px-2 py-3 list-group-item newslink" style="cursor:pointer">
                <div class="d-flex justify-content-start"> 
                    ${media}                   
                    <div class="ms-2">
                        <p class="mb-0 smallest">${hostname}${iDate}</p>
                        <h6 class="fw-bold mb-0 mt-0">${title}</h6>                        
                    </div>
                </div>
                <p class="mt-2 small" style="white-space: pre-line">${content}</p>                
            </li>     
        `);
        $("#first").append($listItem);
        $listItem.on("click", function (e) {
            console.log(v.link);
            getArticleExtract(v.link);
        });
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
        </li>
        `);
        $("#first").append($listItem);
        $listItem.on("click", function (e) {
            document.getElementById("overlay").style.display = "block";
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
                    document.getElementById("overlay1").style.display = "none";
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
    document.getElementById("overlay1").style.display = "none";
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

function populate(data, showContent){
    $("#first").html(``);
    console.log(data);
    $.each(data, function(k,v){
        let content = showContent ? `<p class="mt-2 small" style="white-space: pre-line">${v.content}</p>` : ``
        var {hostname} = new URL(v.link);
        let media = v.media ? `<img class="rounded" src="${v.media}" alt="" height="56" width="56" style="object-fit:cover">` : `<img src="https://icon.horse/icon/${hostname.replace("www.", "")}" alt="" height="56" width="56" style="object-fit:cover">`;       
        var $listItem = $(`
        <li class="py-4 list-group-item border-0 newslink" style="cursor:pointer">
                <p class="mb-1 smaller">${v.iDate}</p>
                <div class="d-flex justify-content-start">  
                 ${media}                  
                    <div class="ms-2">                        
                        <h6 class="fw-bold mb-0 mt-0">${v.title}</h6>                        
                    </div>
                </div>
                 ${content}
            </li>     
        `);
        $("#first").append($listItem);
        $listItem.on("click", function (e) {
            document.getElementById("overlay1").style.display = "block";
            console.log(v.link);
            getArticleExtract(v.link);
        });
    })
}

/* Sharing Snippet
<div class="container mt-3">
                    <div class="row justify-content-end">
                        <div class="col-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-star" viewBox="0 0 16 16">
                                <path
                                    d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                            </svg>
                        </div>
                        <div class="col-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-trash" viewBox="0 0 16 16">
                                <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fill-rule="evenodd"
                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </div>
        
                        <div class="col-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-share" viewBox="0 0 16 16">
                                <path
                                    d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                            </svg>
                        </div>
                        <div class="col-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                                <path fill-rule="evenodd"
                                    d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                            </svg>
                        </div>
                    </div>
                </div>

*/