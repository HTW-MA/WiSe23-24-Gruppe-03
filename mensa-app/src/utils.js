
export function changeColorScheme(selectedCanteen, property, selector) {

    let navbarColor;
    let font;
    let backgroundColor;
    switch (selectedCanteen) {
        //ash
        case '655ff175136d3b580c970f7b':
            navbarColor = '#d11518';
            backgroundColor = '#f7f7f7';
            font='SourceSans3';
            changeFontStyle(font);
            changeButtonStyle('ash');
            break;
        //bht
        case '655ff175136d3b580c970f7d':
        case '655ff175136d3b580c970f7e':
        case '655ff175136d3b580c970f7f':
            navbarColor = '#555555';
            backgroundColor = '#e5e5e5';
            font='CaseTextTrial';
            changeFontStyle(font);
            changeButtonStyle('bht');
            break;
        //charite
        case '655ff175136d3b580c970f82':
        case '655ff175136d3b580c970f84':
            navbarColor = '#ad4371'; //(209, 21, 24)
            backgroundColor = '#f6f3ed';
            font='Roboto';
            changeFontStyle(font);
            changeButtonStyle('charite');
            break;
        //ehb
        case '655ff175136d3b580c970f86':
        case '655ff175136d3b580c970f87':
            navbarColor = '#0078ae';
            backgroundColor ='#e7eed6';
            font = 'Monserrat';
            changeFontStyle(font);
            changeButtonStyle('ehb');
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
            navbarColor = '#99CC00';
            font = 'Arial';
            backgroundColor = '#EBEBEB';
            //die Font der FU ist für nicht mitglieder nicht verfügbar
            changeFontStyle(font);
            changeButtonStyle('fu');

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
            backgroundColor='#ccd6e0';
            font = "Verdana";
            changeFontStyle(font);
            changeButtonStyle("hu");
            break;
        //tu
        case '655ff176136d3b580c970fa0':
        case '655ff176136d3b580c970f9d':
        case '655ff176136d3b580c970f9e':
        case '655ff176136d3b580c970f9f':
        case '655ff176136d3b580c970f9c':
        case '655ff176136d3b580c970fa1':
            navbarColor = '#c50e1f';
            backgroundColor = '#EBEBEB';
            //auch diese Font ist für Uni-Fremde nicht verfügbar
            font="Arial";
            changeFontStyle(font);
            changeButtonStyle('tu');
            //weiß benutzen
            break;
        //htw
        case '655ff175136d3b580c970f80':
        case '655ff175136d3b580c970f81':
        case '655ff175136d3b580c970f92':
            navbarColor = '#76B900';
            backgroundColor = '#EBEBEB';
            font="HTWBerlinOffice";
            changeFontStyle(font);
            changeButtonStyle('htw');
            break;
        //hwr
        case '655ff175136d3b580c970f93':
        case '655ff175136d3b580c970f94':
            navbarColor = '#d50c2f';
            backgroundColor ='#f0f0f1';
            font = "CrimsonText";
            changeFontStyle(font);
            changeButtonStyle('hwr')
            //weiß benutzen
            break;
        //hfm
        case '655ff175136d3b580c970f7c':
        case '655ff175136d3b580c970f85':
        case '655ff175136d3b580c970f90':
            navbarColor ='#7300ff';
            backgroundColor ='#c1ada0';
            font='SourceSans3';
            changeFontStyle(font)
            changeButtonStyle('hfm')

            //schwarz benutzen
            break;
        //hfs
        case '655ff175136d3b580c970f91':
            navbarColor = '#e1000f';
            backgroundColor = '#EBEBEB';
            //font nicht vefügbar, u.a. roboto als ersatz angegeben
            font='Roboto'
            changeFontStyle(font)
            changeButtonStyle('hfs')

            //weiß benutzen
            break;
        //weißensee
        case '655ff176136d3b580c970fa2':
            navbarColor = '#2f8cc3';
            backgroundColor = '#EBEBEB';
            //font nicht verfügbar
            font='Arial'
            changeFontStyle('Arial')
            changeButtonStyle('wss')
            //schwarz benutzen
            break;
        //khsb
        case '655ff176136d3b580c970f9a':
            navbarColor = '#1699a3';
            backgroundColor = '#ecedee'
            font = 'Signika'
            changeFontStyle(font)
            changeButtonStyle('khsb')
            //schwarz benutzen
            break;



        default:
            navbarColor = '#f57373';

            //schwarz benutzen
            break;



    }

    function changeFontStyle(font) {
        document.body.style.fontFamily = `${font}, sans-serif`;
        const dates = document.querySelectorAll('.daty')
        dates.forEach(input=>{
            input.style.font = `${font}, sans-serif`;
        })
    }
    function changeButtonStyle(canteen) {

        const buttons = document.querySelectorAll('.htw-btn-active');
        const smallButtons = document.querySelectorAll('.small-button');
        const arrowButtons= document.querySelectorAll('.arrow');
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
                smallButtons.forEach(button =>{
                    button.style.backgroundColor = 'rgb(118,185,0)';
                    button.style.background = 'linear-gradient(180deg, rgba(118,185,0,1) 0%, rgba(118,185,0,1) 20%, rgba(122,191,0,1) 50%, rgba(118,185,0,1) 80%, rgba(118,185,0,1) 100%)';
                    button.style.color = 'black';
                });
                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = 'rgb(118,185,0)';
                    button.style.color = 'black';
                    button.style.paddingLeft = '2px'
                    button.style.paddingRight = '2px'
                })
                break;
                case 'hu':
                    buttons.forEach(button => {
                        button.style.border ='0';
                        button.style.backgroundColor = '#5b89b0';
                        button.style.lineHeight ='2';
                        button.style.paddingTop = '15px';
                        button.style.paddingBottom = '15px';
                        button.style.textAlign = 'center';

                        button.style.color = 'white';
                        button.style.cursor = 'pointer';
                        button.style.fontWeight = 'bold';
                });

                    smallButtons.forEach(button =>{
                        button.style.backgroundColor = '#5b89b0';
                        button.style.color = 'white';
                    });

                    arrowButtons.forEach(button =>{
                        button.style.backgroundColor = '#5b89b0';
                        button.style.color = 'white';

                    })
                break;
            case 'ash':
                buttons.forEach(button =>{
                    button.style.display ='inline-block';
                    button.fontWeight ='bold';
                    button.textAlign='center';
                    button.verticalAlign='middle';
                    button.cursor='pointer';
                    button.border='1px';
                    button.style.color='white';
                    button.style.background = '#3c3c3b';
                })
                smallButtons.forEach(button =>{
                    button.style.backgroundColor = 'rgb(209,21,21)';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = 'rgb(209,21,21)';
                    button.style.color = 'white';

                })

                break;
            case 'bht':
                buttons.forEach(button =>{
                    button.style.display ='inline-block';
                    button.fontWeight ='400';
                    button.textAlign='center';
                    button.verticalAlign='middle';
                    button.userSelect='none';
                    button.cursor='pointer';
                    button.border='1px';
                    button.style.color='white';
                    button.style.backgroundColor = '#333333';
                    button.style.backgroundImage='none';
                    button.style.backgroundPositionY='0px';
                    button.style.backgroundPositionX='0px';
                    button.style.backgroundSize='initial';
                    button.style.backgroundRepeat='repeat';
                    button.style.backgroundAttachment='scroll';
                    button.style.backgroundOrigin ='initial';
                    button.style.backgroundClip='initial';

                })
                smallButtons.forEach(button =>{
                    button.style.backgroundColor = '#555555';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = '#555555';
                    button.style.color = 'white';

                })
                break;
            case 'charite':
                buttons.forEach(button => {
                    button.style.color = 'white';
                    button.style.backgroundColor = '#ad4371';
                    button.style.display ='inline-flex';
                    button.style.padding = '10px 20px';
                    button.fontWeight = 'bold';
                    button.border = 'none';
                    button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.25)';
                    button.style.textAlign = 'center';
                    button.style.display = 'inline-block';
                    button.cursor = 'pointer';
                    button.style.userSelect = 'none';
                });

                smallButtons.forEach(button => {
                    button.style.backgroundColor = '#ad4371';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button => {
                    button.style.backgroundColor = '#ad4371';
                    button.style.color = 'white';
                });
                break;
            case 'ehb':
                buttons.forEach(button => {
                    button.style.color = 'white';

                    button.style.backgroundColor = '#0078ae';

                    button.style.display = 'inline-flex';
                    button.style.justifyContent = 'center';
                    button.style.alignItems = 'center';


                    button.style.textAlign = 'center';
                    button.style.whiteSpace = 'nowrap';
                    button.style.fontWeight = '700';
                    button.style.cursor = 'pointer';
                    button.style.boxShadow = 'none';
                    button.style.WebkitAppearance = 'none';
                    button.style.transition = 'all .2s ease-in-out';
                    button.style.borderRadius = '0';
                    button.style.border = '1px solid #0072a7';
                });

                smallButtons.forEach(button => {
                    button.style.color = 'white';
                    button.style.backgroundColor = '#0078ae';
                });

                arrowButtons.forEach(button => {
                    button.style.color = 'white';
                    button.style.backgroundColor = '#0078ae';
                });
                break;
            case 'fu':
                buttons.forEach(button => {
                    button.style.border ='0';
                    button.style.backgroundColor = '#99CC00';
                    button.style.lineHeight ='2';
                    button.style.paddingTop = '15px';
                    button.style.paddingBottom = '15px';
                    button.style.textAlign = 'center';

                    button.style.color = 'white';
                    button.style.cursor = 'pointer';
                    button.style.fontWeight = 'bold';
                });

                smallButtons.forEach(button =>{
                    button.style.backgroundColor = '#99CC00';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = '#99CC00';
                    button.style.color = 'white';

                })
                break;
            case 'tu':
                buttons.forEach(button => {
                    button.style.backgroundColor='#c50e1f'
                    button.style.border = '0.0625rem solid #c40d1e';
                    button.style.borderRadius = '1.0625rem';
                    button.style.color = 'white';
                    button.style.display = 'inline-block';
                    button.style.fontFamily = 'Muli,sans-serif,Arial';
                    button.style.fontSize = '1rem';
                    button.style.fontWeight = '400';
                    button.style.lineHeight = '1.125rem';
                    button.style.margin = '0';
                    button.style.minWidth = '10rem';
                    button.style.padding = '0.375rem 1.5625rem 0.5rem';
                    button.style.position = 'relative';
                    button.style.textAlign = 'center';
                    button.style.textDecoration = 'none';
                    button.style.transition = 'background .25s,color .25s';
                    button.style.zIndex = '0';

                    button.style.cursor = 'pointer';
                });

                smallButtons.forEach(button =>{
                    button.style.backgroundColor = '#c50e1f';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = '#c50e1f';
                    button.style.color = 'white';

                })
                break;
            case 'hwr':
                buttons.forEach(button => {
                    button.style.webkitFlex = '0 1 auto';
                    button.style.flex = '0 1 auto';
                    button.style.minWidth = '0';
                    button.style.overflow = 'hidden';
                    button.style.textOverflow = 'ellipsis';
                    button.style.whiteSpace = 'nowrap';
                    button.style.lineHeight = '1 !important';
                    button.style.paddingTop = 'calc(0.99rem - 0.2em)';
                    button.style.paddingBottom = 'calc(0.99rem - 0.08em)';
                    button.style.paddingRight = '0.6rem';
                    button.style.paddingLeft = '0.6rem';
                    button.style.textOverflow = 'ellipsis';
                    button.style.borderRadius = '0.3rem';
                    button.style.color='white'
                });

                smallButtons.forEach(button =>{
                    button.style.backgroundColor = '#D50C2F';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = '#D50C2F';
                    button.style.color = 'white';

                })
                break;
            case 'hfm':
                buttons.forEach(button => {
                    button.style.webkitAppearance = 'none';
                    button.style.background = '0 0';
                    button.style.border = '0';
                    button.style.border = '1px solid #7300ff';
                    button.style.borderRadius = '5px';
                    button.style.color = 'white';
                    button.style.backgroundColor ='#7300ff'
                    button.style.cursor = 'pointer';
                    button.style.display = 'inline-block';
                    button.style.lineHeight = 'normal';
                    button.style.marginBottom = '0.5rem';
                    button.style.padding = '0.625rem 0.85rem';
                    button.style.textAlign = 'center';
                    button.style.textDecoration = 'none';
                    button.style.textTransform = 'uppercase';
                    button.style.webkitTransition = 'background-color .3s,border-color .3s,color .2s';
                    button.style.transition = 'background-color .3s,border-color .3s,color .2s';
                    button.style.webkitUserSelect = 'none';
                    button.style.mozUserSelect = 'none';
                    button.style.msUserSelect = 'none';
                    button.style.userSelect = 'none';
                });

                smallButtons.forEach(button =>{
                    button.style.backgroundColor = '#7300ff';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = '#7300ff';
                    button.style.color = 'white';

                })
                break;
            case 'hfs':
                buttons.forEach(button => {
                    button.style.color = 'white';
                    button.style.backgroundColor = '#0078ae';
                    button.style.display = 'inline-flex';
                    button.style.justifyContent = 'center';
                    button.style.alignItems = 'center';
                    button.style.textAlign = 'center';
                    button.style.whiteSpace = 'nowrap';
                    button.style.fontWeight = '700';
                    button.style.cursor = 'pointer';
                    button.style.boxShadow = 'none';
                    button.style.WebkitAppearance = 'none';
                    button.style.transition = 'all .2s ease-in-out';
                    button.style.borderRadius = '0';
                    button.style.border = '1px solid #0072a7';
                });

                smallButtons.forEach(button =>{
                    button.style.backgroundColor = '#e1000f';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = '#e1000f';
                    button.style.color = 'white';

                })
                break;
            case 'wss':
                //buttonas nicht verfügbar, deswegen sehr basal

                smallButtons.forEach(button =>{
                    button.style.backgroundColor = '#2f8cc3';
                    button.style.color = 'black';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = '#2f8cc3';
                    button.style.color = 'black';

                })
                break;
            case 'khsb':
                buttons.forEach(button => {
                    button.style.margin = '0';


                    button.style.webkitAppearance = 'button';
                    button.style.cursor = 'pointer';
                    button.style.overflow = 'visible';
                    button.style.textTransform = 'none';
                    button.style.appearance = 'auto';
                    button.style.textRendering = 'auto';

                    button.style.letterSpacing = 'normal';
                    button.style.wordSpacing = 'normal';
                    button.style.lineHeight = 'normal';
                    button.style.textIndent = '0px';
                    button.style.textShadow = 'none';
                    button.style.display = 'inline-block';
                    button.style.textAlign = 'center';
                    button.style.alignItems = 'flex-start';
                    button.style.boxSizing = 'border-box';
                    button.style.backgroundColor = '#1699a3';
                    button.style.color='white';
                    button.style.paddingBlock = '1px';
                    button.style.paddingInline = '6px';
                    button.style.borderWidth = '2px';
                    button.style.borderStyle = 'outset';

                });

                smallButtons.forEach(button =>{
                    button.style.backgroundColor = '#1699a3';
                    button.style.color = 'white';
                });

                arrowButtons.forEach(button =>{
                    button.style.backgroundColor = '#1699a3';
                    button.style.color = 'white';

                })
                break;
        }





    }

    document.querySelectorAll(selector).forEach(element => {
        element.style[property] = navbarColor;
    });
    document.body.style.backgroundColor = backgroundColor;
}
