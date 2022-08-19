const Jimp = require('jimp');
const readline = require('readline');
const fs = require('fs');

// A character count to font size map
const fontSizeMap = {
    40 : 50,
    50 : 45,
    60 : 40,
    99 : 32
}

// Loads the input prompts and creates an image for all of them.
async function LoadInput() {

    let inputArray = [];

    const readInterface = readline.createInterface({
        input: fs.createReadStream('resources/input.txt')
    });

    readInterface.on('line', function (line) {
        inputArray.push(line);
    });

    readInterface.on('close', function () {
        CreateImages(inputArray);
    });

}

// Creates an image for an individual prompt.
async function CreateImage(prompt) {

    const fontFile = PickFont(prompt);

    // The font selection failed;
    if (!fontFile) return;

    const selectedFont = await Jimp.loadFont(fontFile);

    const pinTemplate = await Jimp.read('resources/template.png');

    pinTemplate.print(selectedFont, pinTemplate.bitmap.width / 8, pinTemplate.bitmap.height * 0.375, {

        text: prompt,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER

    }, pinTemplate.bitmap.width * 0.75);

    pinTemplate.write('output/' + prompt + '.' + pinTemplate.getExtension());

}

// Picks a font size for a given prompt.
function PickFont(prompt) {

    let characterCount = prompt.length;
    let size;

    for (const [characterCountMax, fontSize] of Object.entries(fontSizeMap)) {

        if (characterCount <= characterCountMax) {
            size = fontSize;
            break;
        }

    }

    if (!size) {
        console.log(`The prompt is too long (${characterCount} characters). The maximum is 99 characters.`)
        return null;
    }

    return 'resources/fonts/raleway' + size + '/raleway' + size + '.ttf.fnt';

}

async function CreateImages(input) {

    input.forEach(prompt => {

        console.log(`Creating image for: '${prompt}'`);
        CreateImage(prompt);

    });

}

LoadInput();