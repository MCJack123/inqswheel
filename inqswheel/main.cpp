//
//  main.cpp
//  inqswheel
//
//  Created by Jack on 5/26/18.
//  Copyright © 2018 JackMacWindows. All rights reserved.
//

// Key format: A01275379
// A->Z/a->z: character
// 01->26: values[0]
// 27->52: values[1]
// 53->78: values[2]
// 79->00/V1/V2/V3/IQ: values[3]

#include <iostream>
#include <fstream>
#include <string>

std::ifstream infile;

// Encrypt has only character, decrypt has only number as value[0]
typedef struct key {
    bool encryptable;
    char character;
    char values[4];
    // values[0] = 1->26, values[1] = 27->52, values[2] = 53->78, values[3] = 79->104
} key;

inline char addWithMax(char num1, char num2, char max, char min = 0) {
    if (num1 + num2 > max) return min + (num1 + num2 - max);
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
            for (int i = 0; i < 4; i++) retval.values[i] = addWithMax(keyval.values[i], rotation, 26*(i+1), 26*i);
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

std::istream * getFile(int argc, const char * argv[]) {
    if (argc > 3) {
        infile.open(argv[3]);
        return new std::istream(infile.std::ios::rdbuf());
    }
    return new std::istream(std::cin.rdbuf());
}

int main(int argc, const char * argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <e|d|n> <key> [file]\nKey format example: A01275379\n";
        return 1;
    }
    std::string keystr(argv[2]);
    if (keystr.length() != 9) {
        std::cerr << "Invalid key format (key format example: A01275379)\n";
        return 2;
    }
    int encstate;
    bool lowercase;
    if (argv[1][0] == 'e') encstate = 1;
    else if (argv[1][0] == 'd') encstate = 0;
    else if (argv[1][0] == 'n') encstate = 2;
    else {
        std::cerr << "Invalid command (use e or d)\n";
        return 3;
    }
    
    key keyval;
    keyval.character = keystr[0];
    if (keyval.character >= 'A' && keyval.character <= 'Z') lowercase = false;
    else if (keyval.character >= 'a' && keyval.character <= 'z') lowercase = true;
    else {
        std::cerr << "Invalid key format (key format example: A01275379)\n";
        return 2;
    }
    try {
        keyval.values[0] = std::stoi(keystr.substr(1, 2));
        keyval.values[1] = std::stoi(keystr.substr(3, 2));
        keyval.values[2] = std::stoi(keystr.substr(5, 2));
    } catch (std::invalid_argument &e) {
        std::cerr << "Invalid key format (key format example: A01275379)\n";
        return 2;
    }
    try {
        keyval.values[3] = std::stoi(keystr.substr(7, 2));
    } catch (std::invalid_argument &e) {
        if (keystr.substr(7, 2) == "V1") keyval.values[3] = 101;
        else if (keystr.substr(7, 2) == "V2") keyval.values[3] = 102;
        else if (keystr.substr(7, 2) == "V3") keyval.values[3] = 103;
        else if (keystr.substr(7, 2) == "IQ") keyval.values[3] = 104;
        else {
            std::cerr << "Invalid key format (key format example: A01275379)\n";
            return 2;
        }
    }
    if (keyval.values[0] > 26) {
        std::cerr << "Invalid key format (key format example: A01275379)\n";
        return 2;
    }
    if (keyval.values[1] < 27 || keyval.values[1] > 52) {
        std::cerr << "Invalid key format (key format example: A01275379)\n";
        return 2;
    }
    if (keyval.values[2] < 53 || keyval.values[2] > 78) {
        std::cerr << "Invalid key format (key format example: A01275379)\n";
        return 2;
    }
    if (keyval.values[3] < 79 || keyval.values[3] > 104) {
        std::cerr << "Invalid key format (key format example: A01275379)\n";
        return 2;
    }
    if (keyval.values[3] == 0) keyval.values[3] = 100;
    
    std::istream * in = getFile(argc, argv);
    srand((unsigned)time(0));
    while (!in->eof()) {
        key value;
        if (encstate == 0) {
            //decrypt
            char ch = in->get();
            value.encryptable = !(ch & 0b10000000);
            value.values[0] = ch & 0b01111111;
            std::cout << fillValue(value, keyval).character;
        } else {
            //encrypt
            char ch = setcase(in->get(), lowercase);
            value.encryptable = !(ch & 0b10000000);
            value.character = ch;
            if (ch == -1) continue;
            int num = rand() % 4;
            assert(num >= 0 && num < 4);
            char values[4];
            strlcpy(values, fillValue(value, keyval).values, 4);
            if (values[0] > 100) values[0] = values[1];
            if (values[1] > 100) values[1] = values[2];
            if (values[2] > 100) values[2] = values[0];
            if (values[3] > 100) num = rand() % 3;
            if (encstate == 1) std::cout << fillValue(value, keyval).values[num];
            else std::cout << (int)fillValue(value, keyval).values[num] << " ";
        }
    }
    
    if (encstate != 1) std::cout << "\n";
    std::cout.flush();
    if (infile.is_open()) infile.close();
    return 0;
}
