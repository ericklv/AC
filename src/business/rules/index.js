const bn = require('bn.js');
const mr = require('miller-rabin').create();

export const rule30 = (initial, time) => ruleX(initial, time, rule30_f);

export const random_generator = lenght => {
    let output = "";
    let rule30_ = rule30("000000010000000", lenght + 1);
    let pos_x = rule30_[0].indexOf("1");

    for (let i = 0; i < lenght; i++) output += rule30_[i + 1][pos_x]
    return output;
};

export const prime_generator = (lenght, initial) => {
    let output = "";
    let rule30_ = rule30(initial, lenght - 1);
    let pos_x = Math.floor((rule30_[0].length) / 2);

    for (let i = 0; i < lenght - 1; i++) output += rule30_[i + 1][pos_x]
    console.log("bf", output.length)
    return "1" + output + "1";
};

export const rule45 = (initial, time) => {
    let times = ruleX(initial, time, rule45_f);
    console.log(times);
};

export const vernam = (text) => {
    let binary_text = string_to_binx(text);
    let key = random_generator(binary_text.length);
    let output = xor(binary_text, key);
    console.log("bin", binary_text);
    console.log("bic", key);
    console.log("out", output);
    console.log(bin_to_string(output))
    console.log(bin_to_hex(output))
    console.log("prime", prime_generator(256, "0010100101100111100101110"));
    return output;
}

export const xor = (a, b) => {
    let output = "";
    if (a.length !== b.length) return null;
    else {
        for (let i = 0; i < a.length; i++) output += a[i] ^ b[i]
        return output
    }
}

export const string_to_binx = string => {
    let output = "";
    for (let i = 0; i < string.length; i++) {
        let char_ = "";
        char_ += string[i].charCodeAt(0).toString(2);
        console.log(char_.length)
        if (char_.length === 7) char_ = "0" + char_
        output += char_;
    }
    return output;
}

export const bin_to_string = bin_ => {
    let bin_array = bin_.match(/.{1,8}/g);
    let output = "";

    bin_array.forEach(arr => {
        output += String.fromCharCode(parseInt(arr, 2));
    })
    return output;
}

export const bin_to_hex = bin_ => {
    let num = parseInt(bin_, 2)
    return num.toString(16)
};

const ruleX = (initial, time, rule) => {
    let array_initial = fix_initial_state(initial, time);
    let x = array_initial.length;
    let times = new Array(time);
    times[0] = array_initial;

    for (let t = 0; t < time; t++) {
        let cells = "";
        for (let i = 0; i < x; i++) {
            if (i < 1) {
                cells = cells + rule(times[t][i], times[t][i + 1])
            } else if (i === x - 1) {
                cells = cells + rule(times[t][i], 0, times[t][i - 1])
            } else {
                cells = cells + rule(times[t][i], times[t][i + 1], times[t][i - 1])
            }
        }
        times[t + 1] = cells;
    }
    return times;
}

const fix_initial_state = (initial, time) => {
    if (time < initial.length) return initial;
    else {
        let fix_length = (time + 1) - (initial.length) / 2;
        let fix = "";
        while (fix.length < fix_length) fix = fix + "0";
        fix = fix + initial + fix;
        return fix;
    }
};

const rule30_f = (a_i, a_i_1 = 0, a_i__1 = 0) => a_i__1 ^ (a_i | a_i_1);
const rule45_f = (a_i, a_i_1 = 0, a_i__1 = 0) => a_i__1 ^ (a_i | !(a_i_1));

export const calculate_reverse = (seed, initial ) => {
    let seed_ = string2num(seed);
    let recovery  = new Array(initial.length);
    let intents = 0;
    while (compare_arrays(seed_, recovery[0])){
        recovery = reverse(initial);
        ++intents;
    }
    return intents;
};

export const reverse = initial => {
    let n = initial.length;
    let recovery = new Array(n);

    for (let x = 0; x < n; x++) {
        recovery[x] = new Array(2 * n - 1)
        for (let y = 0; y < 2 * n - 1; y++) {
            recovery[x][y] = 0
        }
    }

    for (let j = 0; j < n; j++) {
        recovery[0][n + j + 1] =  Math.round(Math.random());
        recovery[j][n] = initial.charAt(j);
    }

    for (let k = 0; k < n - 1; k++) {
        for (let j = 0; j < n - k; j++) {
            recovery[k + 1][n + j] = rule30_f(recovery[k][n + j], recovery[k][n + j + 1], recovery[k][n + j - 1])
        }
    }

    for (let j = 0; j < n; j++) {
        for (let k = n - j - 1; k > 0; k--) {
            recovery[k][n - j - 1] = rule30_f(recovery[k][n - j + 1], recovery[k][n - j + 2], recovery[k + 1][n - j + 1])
        }
    }

    return recovery;
};

const compare_arrays = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

const string2num =  val => val.split('').map(num => {
    let n = Number(num);
    return n === 0 ? n : n || num;
});

