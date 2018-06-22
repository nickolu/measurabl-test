const makeTable = require('./makeTable.js');

describe('findIndexOfMatchingId', () => {
    test('should return an array', () => {
        const isArray = Array.isArray(makeTable.findIndexofMatchingId());
        expect(isArray).toEqual(true);
    });

    test('should get the correct index of matching user in array', () => {
        const users = [{id: 1},{id: 2},{id: 3},{username: 'hello', id: 3}];
        const userIndices = makeTable.findIndexofMatchingId(users, 3);
        expect(userIndices).toEqual([2,3]);
    });
});


describe('combineDataSets', () => {
    test('should return an array', () => {
        const isArray = Array.isArray(makeTable.combineDataSets());
        expect(isArray).toEqual(true);
    });

    test('should return two data sets combined', () => {
        const data1 = [{id: 1, firstName: 'martin'}, {id: 2, firstName: 'bill'}];
        const data2 = [{id: 1, lastName: 'lawrence'}, {id: 2, lastName: 'gates'}];
        const combinedData = makeTable.combineDataSets(data1, data2);

        expect(combinedData).toEqual([{id: 1, firstName: 'martin', lastName: 'lawrence'}, {id: 2, firstName: 'bill', lastName: 'gates'}])
    });
});

describe('makeHtmlTableString', () => {
    test('should return a string', () => {
        expect(typeof makeTable.makeHtmlTableString()).toEqual('string');
    });

    test('should return an html table row with the provided data', () => {
        const sampleData = [{id: 1, firstName: 'henry', lastName: 'cumberbatch', age: 21}];
        const tableString = makeTable.makeHtmlTableString(sampleData);
        
        expect(tableString).toContain("<td>1</td>");
        expect(tableString).toContain("<td>henry</td>");
        expect(tableString).toContain("<td>cumberbatch</td>");
        expect(tableString).toContain("<td>21</td>");
    });
});