// This requires ES6+ to work
function key() {
    this.encryptable = false;
    this.character = "";
    this.values = new Array(4);
    // values[0] = 1->26, values[1] = 27->52, values[2] = 53->78, values[3] = 79->104
}

function addWithMax(num1, num2, max, min = 0) {
    if (num1 + num2 > max) return min + ((num1 + num2) - max) - 1;
    else if (num1 + num2 < min) return max - (min - (num1 + num2)) + 1;
    else return num1 + num2;
}

function co(s) {return s.charCodeAt();}
function st(c) {return String.fromCharCode(c);}

function setcase(c, lowercase) {
    if (co(c) >= co('A') && co(c) <= co('Z') && lowercase) return st(co(c) + (co('a') - co('A')));
    else if (co(c) >= co('a') && co(c) <= co('z') && !lowercase) return st(co(c) - (co('a') - co('A')));
    else if ((co(c) >= co('A') && co(c) <= co('Z')) || (co(c) >= co('a') && co(c) <= co('z'))) return c;
    else return st(co(c) | co(0b10000000));
}

function fillValue(value, keyval) {
    var retval = key();
    if (!value.encryptable) {
        var mainvalue = (value.character != "" ? co(value.character) : value.values[0]);
        retval.character = st(mainvalue);
        for (int i = 0; i < 4; i++) retval.values[i] = mainvalue;
    } else {
        if (value.character != "") {
            //encrypt
            retval.character = value.character;
            var rotation = co(value.character) - co(keyval.character);
            for (var i = 0; i < 4; i++) retval.values[i] = addWithMax(keyval.values[i], rotation, 26*(i+1), 26*i + 1);
        } else {
            //decrypt
            var wheelnum = 0;
            if (value.values[0] > 26 && value.values[0] < 53) wheelnum = 1;
            else if (value.values[0] > 52 && value.values[0] < 79) wheelnum = 2;
            else if (value.values[0] > 78) wheelnum = 3;
            var rotation = value.values[0] - keyval.values[wheelnum];
            for (int i = 0; i < 4; i++) retval.values[i] = addWithMax(keyval.values[i], rotation, 26*(i+1), 26*i);
            retval.character = st(addWithMax(co(keyval.character), rotation, (co(keyval.character) < 'a' ? 'Z' : 'z'), (co(keyval.character) < 'a' ? 'A' : 'a')));
        }
    }
    return retval;
}

function inqswheel(encstate, keystr, text) {
    if (keystr.length != 9) {
        alert("Invalid key format (key format example: A01275379)");
        return '2';
    }
    var lowercase = false;
    if (encstate > 2) return '3';
    
    var keyval = new key();
    keyval.character = keystr[0];
    if (co(keyval.character) >= co('A') && co(keyval.character) <= co('Z')) lowercase = false;
    else if (co(keyval.character) >= co('a') && co(keyval.character) <= co('z')) lowercase = true;
    else {
        alert("Invalid key format (key format example: A01275379)\n");
        return '2';
    }
    keyval.values[0] = parseInt(keystr.substring(1, 2));
    keyval.values[1] = parseInt(keystr.substring(3, 2));
    keyval.values[2] = parseInt(keystr.substring(5, 2));
    keyval.values[3] = parseInt(keystr.substring(7, 2));
    if (isNaN(keyval.values[0] || isNaN(keyval.values[1] || isNaN(keyval.values[2]) {
        alert("Invalid key format (key format example: A01275379)\n");
        return '2';
    }
    if (isNaN(keyval.values[3])) {
        if (keystr.substring(7, 2) == "V1") keyval.values[3] = 101;
        else if (keystr.substring(7, 2) == "V2") keyval.values[3] = 102;
        else if (keystr.substring(7, 2) == "V3") keyval.values[3] = 103;
        else if (keystr.substring(7, 2) == "IQ") keyval.values[3] = 104;
        else {
            alert("Invalid key format (key format example: A01275379)\n");
            return '2';
        }
    }
    if (keyval.values[0] > 26) {
        alert("Invalid key format (key format example: A01275379)\n");
        return '2';
    }
    if (keyval.values[1] < 27 || keyval.values[1] > 52) {
        alert("Invalid key format (key format example: A01275379)\n");
        return '2';
    }
    if (keyval.values[2] < 53 || keyval.values[2] > 78) {
        alert("Invalid key format (key format example: A01275379)\n");
        return '2';
    }
    if (keyval.values[3] < 79 || keyval.values[3] > 104) {
        alert("Invalid key format (key format example: A01275379)\n");
        return "2";
    }
    if (keyval.values[3] == 0) keyval.values[3] = 100;
    var retval = "";
    for (var i = 0; i < text.length; i++) {
        var value = new key();
        if (encstate == 0) {
            //decrypt
            var ch = text[i];
            value.encryptable = (co(ch) & 0b10000000) == 0;
            value.values[0] = co(ch) & 0b01111111;
            retval += fillValue(value, keyval).character;
        } else {
            //encrypt
            var c = text[i];
            if (co(c) == 0x7f || co(c)  == (-118 & 0x7f)) continue;
            var ch = setcase(c, lowercase);
            value.encryptable = (co(ch) & 0b10000000) == 0;
            value.character = ch;
            if (co(ch) == -1 || ch == -1) continue;
            var num = Math.floor(Math.random() * 4);
            assert(num >= 0 && num < 4);
            var values = new Array(4);
            values = fillValue(value, keyval).values;
            if (values[0] > 100) values[0] = values[1];
            if (values[1] > 100) values[1] = values[2];
            if (values[2] > 100) values[2] = values[0];
            if (values[3] > 100) num = rand() % 3;
            if (encstate == 1) retval += st(fillValue(value, keyval).values[num]);
            else retval += fillValue(value, keyval).values[num] + " ";
        }
    }
    
    if (encstate != 1) retval += "\n";
    return retval;
}
