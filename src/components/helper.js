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




export function splitArray(studentArray) {
    for (let char of forbiddenChars) {
        studentArray = studentArray.map((item) => item.replace(char, ''));
    }
    return studentArray;
}

export const findRegex = (str) => {
    var rawString = str;
    var regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    var cleanString = rawString.replace(regex, '');
    return cleanString;
};


export function useGetUrl() {
    const location = useLocation();
    return location.pathname + location.search;
}


export function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

export function compareArrays(arr1, arr2) {
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
