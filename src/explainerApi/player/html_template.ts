export const htmlTemplate = `
<div
    id="explainerRootDiv"
    class="explainerRootDiv"
>
    <div 
        id="threeDiv" 
        class="threeDiv"
    >
        Three.js Scene
    </div>
    <div 
        id="explainerPlayerRootDiv" 
        class="explainerPlayerRootDiv"
    >
        <table 
            id="explainerPlayerTable"
            class="explainerPlayerTable"            
        >
            <tr 
                id="explainerPlayerTableTr"
                class="explainerPlayerTableTr"
            >
                <td>
                    <div 
                        id="explainerPlayerPauseButton"                         
                        class="explainerPlayerPauseButton"
                    >
                        <svg width="34" height="34" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                style="transform: scale(1.5); "
                                fill="#99BBBB"
                                d= "M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"
                            />
                        </svg>
                    </div>
                </td>
                <td>
                    <div 
                        id="explainerPlayerPlayButton"                        
                        class="explainerPlayerPlayButton"                        
                    >
                        <svg width="34" height="34" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                style="transform: scale(1.5); "
                                fill="#99BBBB"
                                d="m10 16.5 6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                            />
                        </svg>
                    </div>
                </td>
                <td style="width: 100%">
                    <input 
                        id="explainerPlayerSlider"
                        class="explainerPlayerSlider"
                        type="range" 
                        min="1" 
                        max="1000"
                        value="50"
                    >
                </td>
                <td>
                    <div 
                        id="explainerPlayerCenterButton"                       
                        class="explainerPlayerCenterButton"                    
                    >
                        <svg width="34" height="34" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                style="transform: scale(1.5); "
                                fill="#99BBBB"
                                d="M5.54 8.46 2 12l3.54 3.54 1.76-1.77L5.54 12l1.76-1.77zm6.46 10-1.77-1.76-1.77 1.76L12 22l3.54-3.54-1.77-1.76zm6.46-10-1.76 1.77L18.46 12l-1.76 1.77 1.76 1.77L22 12zm-10-2.92 1.77 1.76L12 5.54l1.77 1.76 1.77-1.76L12 2z"
                            />
                            <circle cx="18" cy="18" r="4"  fill="#99BBBB" />
                        </svg>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div
                        id="explainerMarkers"
                        class="explainerMarkers"
                    >                      
                    </div>
                </td>
            </tr>
        </table>
        <div 
            id="explainerPlayerTooltip"
            class="explainerPlayerTooltip "
        >
            <div 
                id="explainerPlayerTooltipVal"
                class="explainerPlayerTooltipVal" 
            >                
                42 sec                   
            </div>
        </div>
    </div>
</div>
`