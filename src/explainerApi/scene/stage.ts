import   { 
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
    WebGLRenderer }         from 'three'

import  Stats               from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls }    from 'three/examples/jsm/controls/OrbitControls.js'

export let stage = null as  ( Stage | null)
export class Stage {

    public scene:               Scene
    public camera:              PerspectiveCamera | null
    public controls:            OrbitControls | null
    public renderer:            WebGLRenderer | null
    public ambientLight:        AmbientLight | null = null
    public floor:               Mesh | any
    public sprite:              Sprite | null = null
    public stats:               Stats | null 
    public containerElement:    HTMLElement | null = null
    public cameraStartPosition  = { x: 0, y: 0, z: 170 }
    public wall:                Mesh| null = null
    public cube:                Mesh| null = null

    constructor ( protected divID: string ) {
        
        const containerElement = document.getElementById ( divID )                
        console.log ( 'Stage constructor', containerElement )
        
        let width = 100
        let height = 100

        if ( containerElement?.clientWidth && containerElement?.clientHeight ) {
            this.containerElement = containerElement
            width = containerElement?.clientWidth
            height = containerElement?.clientHeight
        }
        //Scene
        this.scene = new Scene()

        //Camera
        this.camera = new PerspectiveCamera (

            75, 
            width / height, 
            0.1, 
            10000
        )
        console.log ( width, height )
        
        this.camera.position.x = this.cameraStartPosition.x
        this.camera.position.y = this.cameraStartPosition.y
        this.camera.position.z = this.cameraStartPosition.z

        //WebGLRenderer
        //this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
        //this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer = new WebGLRenderer({

            alpha: true,
            antialias: true
          
        })
        this.renderer.setSize( width, height )        
        this.renderer.setClearColor ( '#000000', 1 )        
        this.renderer.setPixelRatio(window.devicePixelRatio)
        //this.renderer.autoClear = false;

        if ( containerElement ) {

            containerElement.innerHTML = ``
            containerElement.appendChild ( this.renderer.domElement )
        }
        //const oneRem = parseInt(getComputedStyle(document.documentElement).fontSize)
        
        this.controls = new OrbitControls ( this.camera, this.renderer.domElement)
        //this.controls = new MapControls( this.camera, this.renderer.domElement );
        this.controls.mouseButtons = {
            LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE
        }
        const onChange = ( ) => {
            this.render ()
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
        this.render ( )        
    }

    insertWall ( ) {

        const geometry = new PlaneGeometry( 400, 400 );
        const material = new MeshBasicMaterial( {
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
        
        if ( !this.containerElement) return
            
        const rect = this.containerElement.getBoundingClientRect();
        const width = rect.width
        const height = rect.height
        
        if ( this.renderer ) {

            this.renderer.setSize ( width, height )
        }
        if ( this.camera ) {

            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()
        }
        this.render()    
    }

    render() {

        if ( this.scene == null ) return
        if ( this.camera == null ) return
        if ( this.renderer == null ) return
                
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

        const  clearThree = ( obj: any ) => {
            
            while ( obj.children.length > 0 ) { 

                clearThree ( obj.children [ 0 ] )
                obj.remove ( obj.children [ 0 ] )
            }
            if ( obj.geometry ) obj.geometry.dispose ( )
          
            if ( obj.material ) { 
                //in case of map, bumpMap, normalMap, envMap ...
                Object.keys ( obj.material ).forEach ( prop => {

                    if ( !obj.material[ prop ] ) return         
                    if (    obj.material[prop] !== null && 
                            typeof obj.material[prop].dispose === 'function' )  {

                        obj.material[ prop ].dispose ( )
                    }

                })
                obj.material.dispose()
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

export const createStage = ( divID: string ) => {
    if ( stage ) stage.free ()
    stage = new Stage ( divID )
    return stage
}