typedef struct key {
    bool encryptable;
    char character;
    char values[4];
    // values[0] = 1->26, values[1] = 27->52, values[2] = 53->78, values[3] = 79->104
} key;

inline char addWithMax(char num1, char num2, char max, char min = 0) {
    if (num1 + num2 > max) return min + ((num1 + num2) - max) - 1;
    else if (num1 + num2 < min) return max - (min - (num1 + num2)) + 1;
    else return num1 + num2;
}

char setcase(char c, bool lowercase) {
    if (c >= 'A' && c <= 'Z' && lowercase) return c + ('a' - 'A');
    else if (c >= 'a' && c <= 'z' && !lowercase) return c - ('a' - 'A');
    else if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')) return c;
    else return c | 0b10000000;
}

key fillValue(key value, key keyval) {
    key retval;
    if (!value.encryptable) {
        char mainvalue = (value.character != 0 ? value.character : value.values[0]);
        retval.character = mainvalue;
        for (int i = 0; i < 4; i++) retval.values[i] = mainvalue;
    } else {
            if (value.character != 0) {
            //encrypt
            retval.character = value.character;
            char rotation = value.character - keyval.character;
            for (int i = 0; i < 4; i++) retval.values[i] = addWithMax(keyval.values[i], rotation, 26*(i+1), 26*i + 1);
        } else {
            //decrypt
            int wheelnum = 0;
            if (value.values[0] > 26 && value.values[0] < 53) wheelnum = 1;
            else if (value.values[0] > 52 && value.values[0] < 79) wheelnum = 2;
            else if (value.values[0] > 78) wheelnum = 3;
            char rotation = value.values[0] - keyval.values[wheelnum];
            for (int i = 0; i < 4; i++) retval.values[i] = addWithMax(keyval.values[i], rotation, 26*(i+1), 26*i);
            retval.character = addWithMax(keyval.character, rotation, (keyval.character < 'a' ? 'Z' : 'z'), (keyval.character < 'a' ? 'A' : 'a'));
        }
    }
    return retval;
}
