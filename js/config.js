//var ServiceUrl = 'http://pollman.kodofisi.com/api/';
var ServiceUrl = 'http://localhost:2024/';

function Deflate(comressedData) {
    try {
        var textReader = new TextReader(new Utf8Translator(new Inflator(new Base64Reader(comressedData))));
        var textData = textReader.readToEnd();
        textData = textData.replace(/\n/g, ' ').replace(/\r/g, ' ');
        var data = JSON.parse(textData);
        textData = null;
        textReader = null;
        return data;
    } catch (e) {
        console.error("Data decompress or callback controller-method access error " + e);
        return {};
    }
}

var weekday = new Array(7);
weekday[0] = "Pazar";
weekday[1] = "Pazartesi";
weekday[2] = "Sali";
weekday[3] = "Carsamba";
weekday[4] = "Persembe";
weekday[5] = "Cuma";
weekday[6] = "Cumartesi";


Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};
Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('');
};


function DateFromYmd(str) {
    if (!/^(\d){8}$/.test(str)) return "invalid date";
    var y = str.substr(0, 4),
        m = str.substr(4, 2),
        d = str.substr(6, 2);

    var date = new Date(y, parseInt(m) - 1, d);
    return date;
}

function GetFieldTitle(filedCode) {
    var fieldTitle = '';
    switch (filedCode) {
        case "text":
            fieldTitle = 'Metin';
            break;
        case "int":
            fieldTitle = 'Sayi';
            break;
        case "date":
            fieldTitle = 'Tarih';
            break;
        case "time":
            fieldTitle = 'Zaman';
            break;
        case "phone":
            fieldTitle = 'Telefon';
            break;
        case "mail":
            fieldTitle = 'Mail';
            break;
        default:
            fieldTitle = '';
            break;
    }
    return fieldTitle;
}

function PrintCanvas(canvasId) {
    var dataUrl = document.getElementById(canvasId).toDataURL();
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Graph</title></head>';
    windowContent += '<body>'
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open('', '', 'width=600,height=260');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}
function PrintElement(elem) {
    var mywindow = window.open('', 'Rapor', 'height=400,width=600');
    mywindow.document.write('<html><head>');
    mywindow.document.write('<link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap.css"/><link rel="stylesheet" href="fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css"/><link rel="stylesheet" href="fonts/pe-icon-7-stroke/css/helper.css"/><link rel="stylesheet" href="styles/style.css">');
    mywindow.document.write('<title>' + document.title + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function () {
        mywindow.print();
        mywindow.close();

    }, 500);

}
function toSeoUrl(url) {
    var encodedUrl = url.toString().toLowerCase();
    encodedUrl = encodedUrl.split(/\&+/).join("-and-")
    encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");
    encodedUrl = encodedUrl.split(/-+/).join("-");
    encodedUrl = encodedUrl.trim('-');
    return encodedUrl;
}


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}