// require file system CORE module
const fs = require('fs');
// import server module
const http = require('http');
// using url core module
const url = require('url');

 
// read file (method of fs module) and save result to JSON var
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

// json to obj and we get array with producs objects
const laptopData = JSON.parse(json);



// create server with cb function that listens to server requests ans has req and res objects
const server = http.createServer((req, res) => {
    
    // implementing ROUTING

    // url module parses request object url property into url object and then saves url obj pathname prop to const
    // so we get requested url string (example: /products)
    const pathName = url.parse(req.url, true).pathname;
    // req.url into url obj. then In url.query.id we find http get query with name id and save it to const
    const id = url.parse(req.url, true).query.id;
    // here we basically parsed requet object url property into url module object and worked with it
    // The url.parse() method takes a URL string, parses it, and returns a URL object.



    // PRODUCTS OVERVIEW

    // if this url or root (handle main page)
    if (pathName === '/products' || pathName === '/') {
        // response with 200 + header
        res.writeHead(200, { 'Content-type': 'text/html'});
       
        
        // call readFile method and save data that we read to new let;
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data; // contains html page string
            
            // now we read main page card html template 
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                
            // to cardsOutup we save = laptopArray for each element (laptop obj) we replace tempo tags with obj props in data (html template for card, using template func. 
            // Then for new created array (full of html strings) we transform it to html string with Join('') and save to cardsOutput
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                // now we have html with laptops cards in cardsOutput
                // in overviewOutupt we replace cards placeholder with new html string(cardsOutput)
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput); 
                // response with this data to page stream and end connection
                res.end(overviewOutput);
            });

        });
        
        
    }
    
    // LAPTOP DETAIL

    // if url is /laptop and id query is less than length of arrays with ids we have
    else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'});
        
    // read file then use it's data (html page in string).
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            // in our parsed array full of notebook objects we find array element (notebook obj) with it's index(id)
            // id is taken from get query. laptops id correspond to index position
            const laptop = laptopData[id];
            // saved laptop obj to laptop const and call replaceTemplate func to replace html templates
            const output = replaceTemplate(data, laptop);
            // finish(end) response with sending retured data (new big html string)
            res.end(output);
        });
    }
    
    // IMAGES

    // handle requests to images (test if pathname has this regExp)
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
        });
    }
    
    // URL NOT FOUND
    else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('URL was not found on the server!');
    }
    
});
// const server end






// listen to our created server - src: http://127.0.0.1:1337/
server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});



// function that replace html temporary templates with choosen by id laptop data from it's object
function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output; // return new html string
}