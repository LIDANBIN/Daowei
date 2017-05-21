var hearder_logic = require('./header');
var index_logic = require('./index');
$(function () {
    hearder_logic.fixHeader();
    hearder_logic.treeMove();
    index_logic();
});