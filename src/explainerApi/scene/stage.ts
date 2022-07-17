import { OrbitControls }            from 'three/examples/jsm/controls/OrbitControls.js'
import { getHtmlTemplate }          from '../player/html_template'
import  Stats                       from 'three/examples/jsm/libs/stats.module.js'

import   {

    Material, 
    Object3D,
    AmbientLight,
    BoxGeometry,
    DirectionalLight,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    MOUSE,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    Sprite,
    WebGLRenderer,    
    MeshStandardMaterial,
    Color,
    NoBlending
}                                       from 'three'

import { CSS3DRenderer, CSS3DObject }   from '../../explainerApi/CSS3DRenderer'

export let stage = null as  ( Stage | null)
export class Stage {

    public camera:              PerspectiveCamera | null = null
    public controls:            OrbitControls | null = null
    public renderer:            WebGLRenderer | null = null
    public rendererCSS:         CSS3DRenderer | null = null    
    public ambientLight:        AmbientLight | null = null
    public sprite:              Sprite | null = null
    public stats:               Stats | null  = null
    public containerElement:    HTMLElement | null = null
    public cameraStartPosition  = { x: 0, y: 0, z: 170 }
    public wall:                Mesh| null = null
    public cube:                Mesh| null = null
    public scene:               Scene  = new Scene()
    public sceneCSS:            Scene  = new Scene()
    public skipOrbitRender      = false
    public outDiv:              HTMLDivElement | null = null

    constructor ( protected divID: string, protected showPlayer: boolean ) {
       
        this.init ( )
    }

    init ( ) {


        const container = document.getElementById ( this.divID )
        this.outDiv = document.createElement ( 'div' )
        this.outDiv.style.position = 'absolute'
        this.outDiv.style.left = '-5000px'        
        this.outDiv.style.overflow = 'hidden'
        
        if ( container ) {
            
            container.innerHTML = getHtmlTemplate ( this.showPlayer )
            container.append ( this.outDiv )
        }
                
        const containerElement = document.getElementById ( 'threeDiv' )
        const containerElementCss = document.getElementById ( 'threeCssDiv' )

        console.log ( 'Stage constructor', containerElement )

        let width = 100
        let height = 100
        
        this.containerElement = containerElement
        if ( containerElement?.clientWidth && containerElement?.clientHeight ) {
            width = containerElement?.clientWidth
            height = containerElement?.clientHeight
            //console.log ( width, height )
        }

        //Camera
        this.camera = new PerspectiveCamera (

            75,
            width / height,
            0.1,
            10000
        )
        console.log ( 'hi, width, height of container =', width, height )

        this.camera.position.x = this.cameraStartPosition.x
        this.camera.position.y = this.cameraStartPosition.y
        this.camera.position.z = this.cameraStartPosition.z

        //WebGLRenderer        
        this.renderer = new WebGLRenderer({ alpha: true, antialias: true})
        this.renderer.setSize( width, height )
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setPixelRatio(window.devicePixelRatio)
        //this.renderer.autoClear = false;

        //CSS3DRenderer
        this.rendererCSS = new CSS3DRenderer()
        this.rendererCSS.setSize( width, height )
        this.rendererCSS.domElement.style.position = 'absolute'
        this.rendererCSS.domElement.style.top = '0'
        this.rendererCSS.domElement.style.background = 'black'
        
        
        if ( containerElement ) {
            
            //containerElement.innerHTML = ``
            containerElement.appendChild ( this.renderer.domElement )
        }        
        if ( containerElementCss ) {

            containerElementCss.appendChild( this.rendererCSS.domElement )
        }
        //const oneRem = parseInt(getComputedStyle(document.documentElement).fontSize)

        //this.controls = new OrbitControls ( this.camera, this.renderer.domElement)
        this.controls = new OrbitControls ( this.camera, this.rendererCSS.domElement)
        
        this.controls.mouseButtons = {
            LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE
        }
        const onChange = ( ) => {

            if ( this.skipOrbitRender ) {

                this.skipOrbitRender = false
                
            } else {

                this.render ()
            }
        }
        this.controls.addEventListener( 'change', onChange );

        //Cube
        const addCube = false
        if ( addCube ) {

            const size = 3
            const geometry = new BoxGeometry( size, size, size)
            const material = new MeshBasicMaterial({
                color: 0x00ffff,
                wireframe: false
            })
            this.cube = new Mesh(geometry, material)
            this.cube.position.set ( 0, 0, 10 )
            this.scene.add ( this.cube )
        }
        this.insertWall ( )

        //Resize
        const onResize = () => { this.onWindowResize ( ) }
        window.addEventListener('resize', onResize, false)

        //Light
        this.addLight ( )

        //Stats
        this.stats = null
        this.stats = Stats()
        this.stats.domElement.style.cssText = `position:absolute; top:0px; left:0px;`
        if ( containerElement ) {

            containerElement.appendChild( this.stats.dom )
        }
        this.onWindowResize ( )

        //this.testCSSText ( )
        console.log ( 'Stage success...' )
    }

    testCSSText ( ) {

        const element = document.createElement( 'div' );
        element.style.position = 'absolute'
        element.style.color = "#FFFFFF"
        element.style.background = 'rgba(0, 0, 70, 40)'
        element.style['padding'] = '10px'
        element.style['margin'] = '0px'
        element.style.fontSize = '128px'
        element.style.lineHeight = '128px'
        element.innerText = 'Hello!'
        
        if ( this.outDiv ) {

            this.outDiv.append ( element )
            const rect = element.getBoundingClientRect()
            console.log ( 'rect:', rect, element )
            this.outDiv.removeChild ( element )

            const domObject = new CSS3DObject ( element )            
            domObject.position.set ( 0, 10, 10 )
            const size = 0.1
            domObject.scale.set ( size, size, size )
            this.sceneCSS.add( domObject )

            const material = new MeshStandardMaterial({
                transparent: true,
                opacity	: 0,
                color	: new Color('#000000'),
                emissive:  new Color('#000000'),
                metalness: 0.5,
                roughness: 0.5,
                blending: NoBlending,
                side	: DoubleSide,
            });
            const geometry = new PlaneGeometry( rect.width * size, rect.height * size )
            const mesh = new Mesh( geometry, material )
            mesh.position.set ( 0, 10, 10 )
            this.scene.add( mesh )
        }
    }

    insertWall ( ) {

        const geometry = new PlaneGeometry( 400, 400 );
        const material = new MeshStandardMaterial( {
            color: 0x444444,
            side: DoubleSide,
            transparent: true,
            opacity: 0
        })
        this.wall = new Mesh( geometry, material )
        this.wall.visible = false
        this.scene.add( this.wall );
    }

    public onWindowResize ( ) {

        if ( ! this.renderer ) return
        this.renderer.setSize ( 0, 0 )
        
        setTimeout(() => {
            
            if ( !this.containerElement ) return
            if ( ! this.renderer ) return
            if ( ! this.renderer.domElement ) return

            const rect = this.containerElement.getBoundingClientRect();
            const width = rect.width
            const height = rect.height

            if ( this.renderer ) {

                this.renderer.setSize ( width, height )
            }
            if ( this.rendererCSS ) {

                this.rendererCSS.setSize ( width, height )
            }
            if ( this.camera ) {

                this.camera.aspect = width / height
                this.camera.updateProjectionMatrix()
            }
            this.render()
        }, 10)
    }

    render() {

        if ( this.scene == null ) return
        if ( this.sceneCSS == null ) return
        if ( this.camera == null ) return
        if ( this.renderer == null ) return
        if ( this.rendererCSS == null ) return

        this.rendererCSS.render ( this.sceneCSS, this.camera )
        this.renderer.render ( this.scene, this.camera )

        if ( this.stats ) this.stats.update()
    }

    addLight ( ) {

        this.ambientLight = new AmbientLight( 0x888888 )
        this.scene?.add( this.ambientLight )
        const dirLight = new DirectionalLight( 0xffffff );
        dirLight.position.set( 0, 0, 200 ).normalize();
        this.scene.add( dirLight );
}

    public free ( ) {

        console.log ( 'free' )

        if ( this.controls ) {

            this.controls.dispose ( )
            this.controls = null
        }
        if ( this.ambientLight ) {

            this.scene.remove( this.ambientLight )
            this.ambientLight = null
        }

        const  clearThree = ( obj: Object3D | Mesh ) => {

            if ( obj instanceof Mesh ) {

                if ( obj.geometry ) obj.geometry.dispose ( )

                if ( obj.material ) {
                    //in case of map, bumpMap, normalMap, envMap ...
                    Object.keys ( obj.material ).forEach ( prop => {

                        const mat =  obj.material as any
                        if ( !mat[ prop ] ) return
                        if (    mat[prop] !== null &&  typeof mat[prop].dispose === 'function' )  {

                            mat[ prop ].dispose ( )
                        }

                    })
                    const material = obj.material as Material
                    material.dispose()
                }
            }
            if ( obj instanceof Object3D ) {

                while ( obj.children.length > 0 ) {

                    clearThree ( obj.children [ 0 ] )
                    obj.remove ( obj.children [ 0 ] )
                }
            }
        }
        if ( this.stats ) {

            this.stats.domElement.innerHTML = ''
            this.stats = null
        }
        //window.removeEventListener( 'resize', this.onResize )
        clearThree( this.scene)
        if ( this.containerElement ) {

            while ( this.containerElement.firstChild ) {

                this.containerElement.removeChild ( this.containerElement.firstChild )
            }
            this.containerElement.innerHTML = ''
        }

        this.camera = null
        this.renderer = null

        stage = null
    }
}

export const createStage = ( divID: string, showPlayer: boolean ) => {
    if ( stage ) stage.free ()
    stage = new Stage ( divID, showPlayer )
    return stage
}