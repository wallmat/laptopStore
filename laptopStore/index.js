const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    //PRODUCT OVERVIEW
    if(pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'})
        
        //load up the overview template and fill it with cards
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            
            let overviewOutput = data;
            //load up the cards template to fill out
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {

                //loop though all the laptops and make a card for each
                const cardsOutput = laptopData.map(item => replaceTemplate(data, item)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });
    } 
    //LAPTOP DETAILS
    else if(pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'})

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {

            const laptop = laptopData[id];
            let output = replaceTemplate(data, laptop);

            res.end(output);
        });

    }
    //IMAGES
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'})
            res.end(data);
        });
    }
    //URL NOT FOUND 404
    else {
        res.writeHead(404, { 'Content-type': 'text/html'})
        res.end('this page was not found');
    }

});

server.listen(1337, '127.0.0.1', () => {
    console.log('listening');
});

function replaceTemplate(originalHtml, laptop) {

    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}