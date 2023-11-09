import React from 'react';
import { useLocation } from 'react-router-dom';
let forbiddenChars = ['!', '?', '.'];
export const blobToBase64 = (blob, callback) => {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
        var dataUrl = this.result;
        callback(dataUrl);
    });
    reader.readAsDataURL(blob);
    return reader;
};

export const maxWidth = 1080;
export function useWindowSize() {
    const [size, setSize] = React.useState([0, 0]);
    React.useLayoutEffect(() => {
        function updateSize() {
            setSize([
                window.innerWidth > maxWidth ? maxWidth : '100%',
                window.innerHeight,
            ]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}



export function getLayout(url) {
    if (url) {
        let value = url.split('&')[1] ? url.split('&')[1].split('=')[1] : '';
        return value;
    }
}

export function removeForbiddenCharacters(input) {
    for (let char of forbiddenChars) {
        if (localStorage.getItem('contentText').includes(char)) {
            input = input.concat(char);
        }
    }
    return input;
}

export function splitArray(studentArray) {
    for (let char of forbiddenChars) {
        studentArray = studentArray.map((item) => item.replace(char, ''));
    }
    return studentArray;
}
export function findRegex(str) {
    var rawString = str;
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    var cleanString = rawString.replace(regex, '');
    return cleanString;
}

export function useGetUrl() {
    const location = useLocation();
    return location.pathname + location.search;
}

export function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

export function compareArrays(arr1, arr2) {
    // let words_result = [];

    // // Check if arrays have the same length
    // if (arr1.length !== arr2.length) {
    //   words_result.push('red');
    //   return words_result;
    // }

    // // Iterate over each element and compare
    // for (let i = 0; i < arr1.length; i++) {
    //   if (arr1[i] === arr2[i]) {
    //     words_result.push('green');
    //   } else {
    //     words_result.push('orange');
    //   }
    // }

    // return words_result;
    const result = {
        matched: [],
        mismatched: [],
        order: [],
    };

    for (let i = 0; i < arr1.length; i++) {
        const value1 = arr1[i];
        const value2 = arr2[i];

        if (value1 === value2) {
            result.matched.push(value1);
        } else if (arr2.includes(value1)) {
            result.order.push(value2);
        } else {
            result.mismatched.push(value2);
        }
    }

    return result;
}
