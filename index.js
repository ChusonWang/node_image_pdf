const { createCanvas } = require('canvas');
const Chart = require('chart.js/auto');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
];

async function generateImage(type, output) {
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: type,
        data: {
            labels: data.map(row => row.year),
            datasets: [
                {
                    label: 'Acquisitions by year',
                    data: data.map(row => row.count),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 86, 205)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 86, 205)',
                      ],
                }
            ]
        }
    });
    const out = fs.createWriteStream(output);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    return new Promise((resolve, reject) => {
        out.on('finish', () => resolve(output));
        out.on('error', (err) => reject(err));
    });
}

async function createPdf() {
    const lineChart = await generateImage('line', 'line.png');
    const pieChart = await generateImage('pie', 'pie.png');
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('output.pdf'));
    doc.image(lineChart, 50, 0, { width: 400, align: 'center' });
    doc.image(pieChart, 50, 450, { width: 400, align: 'center' });
    doc.end();
}

createPdf().catch(console.error);
