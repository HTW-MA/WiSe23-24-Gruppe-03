export function changeColorScheme(selectedCanteen, property, selector) {

    let navbarColor;

    switch (selectedCanteen) {
        //ash
        case '655ff175136d3b580c970f7b':
            navbarColor = '#d11518'
            break;
        //bht
        case '655ff175136d3b580c970f7d':
        case '655ff175136d3b580c970f7e':
        case '655ff175136d3b580c970f7f':
            navbarColor = '#555555';
            break;
        //charite
        case '655ff175136d3b580c970f82':
        case '655ff175136d3b580c970f84':
            navbarColor = '#7e898f';
            break;
        //ehb
        case '655ff175136d3b580c970f86':
        case '655ff175136d3b580c970f87':
            navbarColor = '#0078ae';
            break;
        //fu
        case '655ff175136d3b580c970f88':
        case '655ff175136d3b580c970f89':
        case '655ff175136d3b580c970f8a':
        case '655ff175136d3b580c970f8b':
        case '655ff175136d3b580c970f8c':
        case '655ff175136d3b580c970f8d':
        case '655ff175136d3b580c970f8f':
        case '655ff175136d3b580c970f8e':
            navbarColor = '#ccff00';
            break;
        //hu
        case '655ff175136d3b580c970f83':
        case '655ff176136d3b580c970f96':
        case '655ff176136d3b580c970f95':
        case '655ff176136d3b580c970f9b':
        case '655ff176136d3b580c970f98':
        case '655ff176136d3b580c970f99':
        case '655ff176136d3b580c970f97':
            navbarColor = '#5b89b0';
            break;
        //tu
        case '655ff176136d3b580c970fa0':
        case '655ff176136d3b580c970f9d':
        case '655ff176136d3b580c970f9e':
        case '655ff176136d3b580c970f9f':
        case '655ff176136d3b580c970f9c':
        case '655ff176136d3b580c970fa1':
            navbarColor = '#c50e1f';
            break;
        //htw
        case '655ff175136d3b580c970f80':
        case '655ff175136d3b580c970f81':
        case '655ff175136d3b580c970f92':
            navbarColor = '#76B900';
            break;
        //hwr
        case '655ff175136d3b580c970f93':
        case '655ff175136d3b580c970f94':
            navbarColor = '#d50c2f';
            break;
        //hfm
        case '655ff175136d3b580c970f7c':
        case '655ff175136d3b580c970f85':
        case '655ff175136d3b580c970f90':
            navbarColor ='#eee9e5';
            break;
        //hfs
        case '655ff175136d3b580c970f91':
            navbarColor = '#e1000f';
            break;
        //weißensee
        case '655ff176136d3b580c970fa2':
            navbarColor = '#88ffb5';
            break;
        //khsb
        case '655ff176136d3b580c970f9a':
            navbarColor = '#88ffb5';
            break;


        default:
            navbarColor = '#f57373';
            break;
    }
    // ... existing switch case logic to determine the color based on selectedCanteen ...

    // Apply the color to the specified property of the elements matched by selector
    document.querySelectorAll(selector).forEach(element => {
        element.style[property] = navbarColor;
    });
}
