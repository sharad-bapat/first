//get RSS Data
function get_rss(url) {
    return new Promise((resolve, reject) => {
        try {           
            let parser = new RSSParser();
            const CORS_PROXY = "http://sbcors.herokuapp.com/"
            parser.parseURL(CORS_PROXY + url, function (err, feed) {
               resolve(feed)
            })
        } catch (err) { reject(err) }
    })

}