#  inqswheel
An encryptor based on [Vsauce's Inq cipher wheel](https://www.youtube.com/watch?v=TvsiLV7RLx4).

# Usage
## Compiling
`g++ -o inqswheel inqswheel/main.cpp`
## JavaScript
Import the script file with `<script src="inqswheel.js"></script>` in HTML or `var inqswheel = require('./inqswheel')`. Then run `inqswheel(encstate, keystr, text)`, where `encstate` is 0 for decrypt, 1 is encrypt to numbers, and 2 is encrypt to data; `keystr` is the key, and `text` is the data to encrypt/decrypt.
## Running
`Usage: inqswheel <encrypt|decrypt|number> <key> [file]`  
Can take input from stdin or a file. All output goes to stdout. `number` outputs the numbers for encryption, while `encrypt` outputs `char`s with the value. The key must be formatted as follows:  
```
Key format: A01275379
A->Z/a->z: character (outer) wheel
01->26: first wheel
27->52: second wheel
53->78: third wheel
79->00/V1/V2/V3/IQ: fourth (inner) wheel
IQ = Inq symbol
```  
The numbers in the key show which numbers line up with what character, so `A01275379` means the 'A' character on the wheel lines up with 12, 27, 53, and 79.  
The case of the output is the same as the case of the key character. Any non-alphabetic character will be outputted the same except with the 8th bit set.  

### Disclaimer
Do not use this algorithm to encrypt sensitive information. If you do, you are responsible for any damage that may be caused by hacking. Even though there are almost 12 million combinations, a good enough computer could crack the encryption in mere minutes. 
