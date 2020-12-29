// Import dependencies
const fs = require('fs');
const PDFParser = require('pdf2json');

// Get utils
const { getDesciption } = require('./utils');

// Get all the filenames from the specified folder
const files = fs.readdirSync('documents/cie');

// All of the parse data
let data = [];

// Make a IIFE so we can run asynchronous code
(async () => {
    // Await all of the data to be passed
    // For each file in the specified folder
    await Promise.all(files.map(async (file) => {

        // Set up the pdf parser
        let pdfParser = new PDFParser(this, 1);

        // Load the pdf document
        pdfParser.loadPDF(`documents/cie/${file}`);

        // Parsed the data
        let codes = await new Promise(async (resolve, reject) => {

            // On data ready
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
  
                // The raw PDF data in text form
                const raw = pdfParser.getRawTextContent();

                const indexes = [];
                const values = raw.matchAll(/([A-Z]){1}([0-9]{2})\w/g);

                for (const value of values) {
                    indexes.push({
                        index: value.index,
                        code: value[0]
                    })
                }

                const dataLength = indexes.length;

                indexes.forEach((data, index) => {
                    let description;
                    const currentIndex = data.index;
                    const nextIndex = indexes[index + 1] && indexes[index + 1].index;
                    if (index === (dataLength - 1)) {
                        description = getDesciption(raw, data, currentIndex, raw[-1]);
                        return indexes[index]['description'] = description;
                    }
                    description = getDesciption(raw, data, currentIndex, nextIndex);
                    indexes[index]['description'] = description;
                });

                resolve(indexes);
            });
        });
        // Add the patient to the patients array
        data = [...codes]
    }));
    // Save the extracted information to a json file
    fs.writeFileSync('codes.json', JSON.stringify(data));

})();  
