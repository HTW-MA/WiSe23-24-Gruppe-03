
export function changeColorScheme(selectedCanteen, property, selector) {

    let navbarColor;
    let font;
    let backgroundColor;
    switch (selectedCanteen) {

        case '655ff175136d3b580c970f7b':
            navbarColor = '#d11518' //(209, 21, 24)
            //weiß benutzen
            break;
        //bht
        case '655ff175136d3b580c970f7d':
        case '655ff175136d3b580c970f7e':
        case '655ff175136d3b580c970f7f':
            navbarColor = '#555555'; //(85, 85, 85)
            //weiß benutzen
            break;
        //charite
        case '655ff175136d3b580c970f82':
        case '655ff175136d3b580c970f84':
            navbarColor = '#7e898f'; //(209, 21, 24)
            //schwarz benutzen
            break;
        //ehb
        case '655ff175136d3b580c970f86':
        case '655ff175136d3b580c970f87':
            navbarColor = '#0078ae';
            //weiß benutzen
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
            //schwarz benutzen
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
            font = "Verdana"
            changeFontStyle(font)
            changeButtonStyle("hu")
            //schwarz benutzen
            break;
        //tu
        case '655ff176136d3b580c970fa0':
        case '655ff176136d3b580c970f9d':
        case '655ff176136d3b580c970f9e':
        case '655ff176136d3b580c970f9f':
        case '655ff176136d3b580c970f9c':
        case '655ff176136d3b580c970fa1':
            navbarColor = '#c50e1f';
            font="Arial"
            changeFontStyle(font)
            //weiß benutzen
            break;
        //htw
        case '655ff175136d3b580c970f80':
        case '655ff175136d3b580c970f81':
        case '655ff175136d3b580c970f92':
            navbarColor = '#76B900';
            backgroundColor = '#EBEBEB';
            font="HTWBerlinOffice-Regular"
            changeFontStyle(font)
            changeButtonStyle('htw')
            //schwarz benutzen
            break;
        //hwr
        case '655ff175136d3b580c970f93':
        case '655ff175136d3b580c970f94':
            navbarColor = '#d50c2f';
            //weiß benutzen
            break;
        //hfm
        case '655ff175136d3b580c970f7c':
        case '655ff175136d3b580c970f85':
        case '655ff175136d3b580c970f90':
            navbarColor ='#eee9e5';
            //schwarz benutzen
            break;
        //hfs
        case '655ff175136d3b580c970f91':
            navbarColor = '#e1000f';
            //weiß benutzen
            break;
        //weißensee
        case '655ff176136d3b580c970fa2':
            navbarColor = '#88ffb5';
            //schwarz benutzen
            break;
        //khsb
        case '655ff176136d3b580c970f9a':
            navbarColor = '#88ffb5';
            //schwarz benutzen
            break;



        default:
            navbarColor = '#f57373';

            //schwarz benutzen
            break;



    }

    function changeFontStyle(font) {
        document.body.style.fontFamily = `${font}, sans-serif`;
    }
    function changeButtonStyle(canteen) {

        const buttons = document.querySelectorAll('.htw-btn-active');
        switch(canteen){
            case 'htw':
                buttons.forEach(button => {
                    button.style.background = 'rgb(118,185,0)';
                    button.style.background = 'linear-gradient(180deg, rgba(118,185,0,1) 0%, rgba(118,185,0,1) 20%, rgba(122,191,0,1) 50%, rgba(118,185,0,1) 80%, rgba(118,185,0,1) 100%)';
                    button.style.border = 'none';
                    button.style.color = 'black';
                    button.style.paddingTop = '15px';
                    button.style.paddingBottom = '15px';
                    button.style.textAlign = 'center';
                    button.style.textDecoration = 'none';
                    button.style.display = 'inline-block';
                    button.style.margin = '4px 2px';
                    button.style.cursor = 'pointer';
                    button.style.boxShadow = '0 4px 2px -2px #7a7a7a';
                    button.style.font = '100%/1.5 "HTWBerlin", Helvetica, sans-serif !important';
                    button.style.borderRadius = '2px';
                    button.style.flexGrow = '0';
                    button.style.fontWeight = '600 !important';
                    button.style.fontSize = '1em !important';
                    button.style.paddingLeft = '15px';
                    button.style.paddingRight = '15px';
                    button.style.cursor = 'pointer';
                });
                break;
                case 'hu':
                    buttons.forEach(button => {
                        button.style.border ='0';
                        button.style.backgroundColor = 'rgb(0,51,102)';
                        button.style.lineHeight ='2';
                        button.style.padding = '0.5rem 1.5rem';
                        button.style.color = 'white';
                        button.style.cursor = 'pointer';
                        button.style.fontWeight = 'bold';
                });

        }





    }

    document.querySelectorAll(selector).forEach(element => {
        element.style[property] = navbarColor;
    });
    document.body.style.backgroundColor = backgroundColor;
}
