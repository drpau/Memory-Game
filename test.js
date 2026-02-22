const puppeteer = require('puppeteer');
const path = require('path');
const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');

async function runTests() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    let testsPassed = 0;
    let testsFailed = 0;
    const results = [];

    function test(name, fn) {
        return fn().then(() => {
            testsPassed++;
            results.push('✓ ' + name);
        }).catch(err => {
            testsFailed++;
            results.push('✗ ' + name + ': ' + err.message);
        });
    }

    function assert(condition, message) {
        if (!condition) throw new Error(message);
    }

    await page.goto(fileUrl);
    await page.waitForSelector('#mode-screen');
    console.log('=== Dog Breed Match - Test Suite ===');

    await test('Mode selection screen loads', async () => {
        const singleBtn = await page.$('.mode-btn.single');
        const twoBtn = await page.$('.mode-btn.two-player');
        assert(singleBtn && twoBtn, 'Mode buttons not found');
    });

    await test('Single player mode starts correctly', async () => {
        await page.click('.mode-btn.single');
        await page.waitForSelector('#game-screen');
        const gameScreen = await page.$('#game-screen');
        const display = await page.evaluate(el => el.style.display, gameScreen);
        assert(display === 'flex', 'Game screen not visible');
    });

    await test('Game board has 24 tiles', async () => {
        const tiles = await page.$$
('.tile');
        assert(tiles.length === 24, 'Expected 24 tiles');
    });

    await test('Grid layout is 6x4', async () => {
        const gridStyle = await page.evaluate(() => {
            return window.getComputedStyle(document.getElementById('game-board')).gridTemplateColumns;
        });
        const columns = gridStyle.split(' ').length;
        assert(columns === 6, 'Expected 6 columns');
    });

    await test('Tiles can be flipped', async () => {
        const tiles = await page.$$
('.tile');
        await tiles[0].click();
        await new Promise(r => setTimeout(r, 300));
        const flipped = await page.evaluate(() => document.querySelector('.tile').classList.contains('flipped'));
        assert(flipped, 'Tile not flipped');
    });

    await test('Cannot click more than 2 tiles', async () => {
        await page.click('.btn-restart');
        await new Promise(r => setTimeout(r, 500));
        const tiles = await page.$$
('.tile');
        for(let i=0; i<3; i++) await tiles[i].click();
        await new Promise(r => setTimeout(r, 100));
        const flippedCount = await page.evaluate(() => document.querySelectorAll('.tile.flipped').length);
        assert(flippedCount <= 2, 'Too many tiles flipped');
    });

    await test('Match handling works', async () => {
        await page.click('.btn-restart');
        await new Promise(r => setTimeout(r, 500));
        const breeds = await page.evaluate(() => Array.from(document.querySelectorAll('.tile')).map(t => t.dataset.breed));
        const firstIndex = breeds.findIndex((b, i) => breeds.indexOf(b) !== i);
        const firstMatch = breeds.indexOf(breeds[firstIndex]);
        const tiles = await page.$$
('.tile');
        await tiles[firstMatch].click();
        await new Promise(r => setTimeout(r, 300));
        await tiles[firstIndex].click();
        await new Promise(r => setTimeout(r, 600));
        const matched = await page.evaluate(() => Array.from(document.querySelectorAll('.tile')).filter(t => t.classList.contains('matched')).length);
        assert(matched === 2, 'Match not handled');
    });

    await test('Score updates on match', async () => {
        const score = await page.evaluate(() => document.getElementById('p1-score').textContent);
        assert(parseInt(score) > 0, 'Score not updated');
    });

    await test('Two player mode switches turns', async () => {
        await page.click('.btn-menu');
        await new Promise(r => setTimeout(r, 300));
        await page.click('.mode-btn.two-player');
        await new Promise(r => setTimeout(r, 300));
        const tiles = await page.$$
('.tile');
        await tiles[0].click();
        await tiles[1].click();
        await new Promise(r => setTimeout(r, 1500));
        const indicator = await page.evaluate(() => document.getElementById('turn-indicator').textContent);
        assert(indicator.includes('2'), 'Turn not switched');
    });

    await test('Restart button works', async () => {
        await page.click('.btn-restart');
        await new Promise(r => setTimeout(r, 300));
        const tiles = await page.$$
('.tile');
        assert(tiles.length === 24, 'Tiles not reset');
    });

    await test('Main menu button works', async () => {
        await page.click('.btn-menu');
        await new Promise(r => setTimeout(r, 300));
        const modeScreen = await page.$('#mode-screen');
        const display = await page.evaluate(el => el.style.display, modeScreen);
        assert(display === 'flex', 'Mode screen not shown');
    });

    await browser.close();
    console.log('');
    results.forEach(r => console.log(r));
    console.log('');
    console.log('Results: ' + testsPassed + '/' + (testsPassed + testsFailed) + ' tests passed');
    process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch(e => { console.error(e); process.exit(1); });
