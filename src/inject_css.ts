const css = `

html, body {
    border: 0px;
    margin: 0px;
    padding: 0px;
  }
  
.test {

    color: chocolate;
}

.explainerRootDiv {

    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
}

.threeCssDiv {

    left: 0px;
    top: 0px;
    position: absolute;
    width: 100%;
    height: 100%;
}

.threeDiv {

    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #99BBBB;
}

.explainerPlayerRootDiv {

    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    background: #000;
}

.explainerPlayerTooltip {

    position: absolute;
    color: #99BBBB;
    left: 500px;
    top: -30px;
    z-index: 100;
}

.explainerPlayerTooltipVal {

    padding: 3px;
    padding-left: 6px;
    padding-right: 6px;
    border-radius: 8px;
    font-size: 14px;
    outline: 2px solid #99BBBB;
}

table {

    border:0px;
    border-collapse:collapse;
    border-spacing:0px;
}

td {

    padding:0px;
    border-width:0px;
    margin:0px;
}

.explainerPlayerTable {

    width: 100%;
}

.explainerPlayerTableTr {

    height: 36px;
}

.explainerPlayerPauseButton {

    width: 36px;
    height: 36px;
    border-radius: 25px;
    margin-left: 10px;
    background: '';
}

.explainerPlayerPauseButton:hover {

    background: #484848;
}

.explainerPlayerPlayButton {

    width: 36px;
    height: 36px;
    border-radius: 25px;
    background: '';
}

.explainerPlayerPlayButton:hover {

    background: #484848;
}

.explainerPlayerSlider {

    width: 100%;
    accent-color: #99BBBB;
    padding: 0px;
    margin: 0px;
    margin-top: 6px;
    height: 10px;
}

.explainerPlayerCenterButton {

    width: 36px;
    height: 36px;
    border-radius: 25px;
    margin-right: 10px;
    background: '';
}

.explainerPlayerCenterButton:hover {

    background: #484848;
}

.explainerMarkers {

    color: #99BBBB;
    position: relative;
    width: 0px;
    height: 40px;
    margin-top: -42px;
}

.html {

    position:   'absolute';
    color:      "#00FF00";
    background: 'transparent';
    padding:    '0px';
    margin:     '0px';
    fontSize:   '128px';
    lineHeight: '128px';
}

`

interface Style extends HTMLStyleElement {

    styleSheet: {cssText: string}
}

export let cssExplainer: Style | null = null

export const addStyle = ( style: string ) => {

    if ( cssExplainer && cssExplainer.styleSheet ) {

        cssExplainer.styleSheet.cssText += style
    }
}

export const styleInject = ( ) => {

    const insertAt = 'top';

    if (!css || typeof document === 'undefined') { return }

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style') as Style;
    style.type = 'text/css';

    if (insertAt === 'top') {

        if (head.firstChild) {

            head.insertBefore(style, head.firstChild);

        } else {

            head.appendChild(style)
        }
    }

    if (style.styleSheet) {

        style.styleSheet.cssText = css

    } else {

        style.appendChild(document.createTextNode(css))
    }
    
    cssExplainer = style
}